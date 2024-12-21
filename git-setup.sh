#!/bin/bash

# Create a custom git command for protected merge
cat >.git/protect-merge <<'EOF'
#!/bin/bash

# Parse arguments
use_cache=true
verbose=false
target_branch=""
merge_args=()
has_ff_flag=false

for arg in "$@"; do
    if [ "$arg" = "--no-cache" ]; then
        use_cache=false
    elif [ "$arg" = "-v" ]; then
        verbose=true
    elif [[ "$arg" == "--ff"* ]]; then
        has_ff_flag=true
        merge_args+=("$arg")
    elif [ -z "$target_branch" ]; then
        target_branch="$arg"
    else
        merge_args+=("$arg")
    fi
done

if [ "$has_ff_flag" = false ]; then
    merge_args+=("--no-ff")
fi

repo_root=$(git rev-parse --show-toplevel)
cache_dir="$repo_root/.protect-merge-cache"
cache_manifest="$cache_dir/manifest.txt"

update_cache() {
    local file="$1"
    local hash="$2"
    mkdir -p "$cache_dir/files"
    cp "$file" "$cache_dir/files/$(echo "$file" | sed 's/\//_/g')"
    echo "$file $hash" >> "$cache_manifest"
}

get_gitattributes_hash() {
    find . -name ".gitattributes" -type f -exec sha256sum {} \; | sort | sha256sum | cut -d' ' -f1
}

rebuild_cache=false
current_gitattributes_hash=$(get_gitattributes_hash)

if [ "$use_cache" = false ]; then
    rebuild_cache=true
elif [ ! -f "$cache_manifest" ]; then
    rebuild_cache=true
elif [ -f "$cache_dir/gitattributes.hash" ]; then
    stored_hash=$(cat "$cache_dir/gitattributes_hash")
    if [ "$stored_hash" != "$current_gitattributes_hash" ]; then
        rebuild_cache=true
    fi
fi

if [ "$rebuild_cache" = true ]; then
    rm -rf "$cache_dir"
    mkdir -p "$cache_dir/files"

    protected_files=$(git ls-files | git check-attr merge --stdin | grep "merge: keep-ours" | cut -d: -f1)
    echo "$protected_files" > "$cache_dir/protected_files.txt"
    echo "$current_gitattributes_hash" > "$cache_dir/gitattributes_hash"

    while read -r file; do
        [ -z "$file" ] && continue
        hash=$(git hash-object "$file")
        update_cache "$file" "$hash"
    done <<< "$protected_files"
else
    protected_files=$(cat "$cache_dir/protected_files.txt")
fi

merge_base=$(git merge-base HEAD "$target_branch")

if [ -n "$protected_files" ]; then
    changing_files=$(git diff --name-only "$merge_base" "$target_branch")

    tmp_dir=$(mktemp -d)
    protect_list=""

    while read -r file; do
        if echo "$changing_files" | grep -q "^${file}$"; then
            current_hash=$(git hash-object "$file")
            cached_path="$cache_dir/files/$(echo "$file" | sed 's/\//_/g')"

            if [ -f "$cached_path" ]; then
                cached_hash=$(git hash-object "$cached_path")
                if [ "$current_hash" != "$cached_hash" ]; then
                    update_cache "$file" "$current_hash"
                fi
            else
                update_cache "$file" "$current_hash"
            fi

            mkdir -p "$(dirname "$tmp_dir/$file")"
            cp "$cached_path" "$tmp_dir/$file"
            protect_list="$protect_list$file"$'\n'
        fi
    done <<< "$protected_files"

    echo "$protect_list" > "$tmp_dir/protected_files.txt"
fi

# Perform the merge with its original output
git merge "$target_branch" "${merge_args[@]}"
merge_status=$?

# Our additional protections
if [ -f "$tmp_dir/protected_files.txt" ] && [ "$merge_status" -eq 0 ]; then
    if [ -s "$tmp_dir/protected_files.txt" ]; then
        restored_count=0
        restored_files=""
        while read -r file; do
            [ -z "$file" ] && continue
            restored_files="${restored_files}${file}\n"
            cp "$tmp_dir/$file" "$file"
            git add "$file"
            ((restored_count++))
        done < "$tmp_dir/protected_files.txt"

        if [ "$restored_count" -gt 0 ]; then
            [ "$verbose" = true ] && echo -e "Protected files:\n${restored_files}"
            git commit --amend --no-edit

            # Check if there are any changes after restoring
            if [ -z "$(git diff HEAD^ HEAD --name-only)" ]; then
                git reset --hard HEAD^
                merge_status=1
            else
                [ "$verbose" = false ] && echo "Restored $restored_count protected files"
            fi
        fi
    fi
    rm -rf "$tmp_dir"
fi

exit $merge_status
EOF

chmod +x .git/protect-merge

# Create a Git alias
git config --local alias.protect-merge '!.git/protect-merge'

# Add .protect-merge-cache to .gitignore if not already present
if ! grep -q "^\.protect-merge-cache$" .gitignore 2>/dev/null; then
  echo ".protect-merge-cache" >>.gitignore
fi

echo "Protected merge command has been set up successfully."
echo "Usage: git protect-merge <target-branch> [-v,--no-cache]"
