#!/bin/bash

# Create a custom git command for protected merge
cat >.git/protect-merge <<'EOF'
#!/bin/bash

# Get the merge base to check what will change
merge_base=$(git merge-base HEAD "$1")
target_branch="$1"
shift

# Get list of protected files
protected_files=$(git ls-files | git check-attr merge --stdin | grep "merge: keep-ours" | cut -d: -f1)

if [ -n "$protected_files" ]; then
    # Get files that will change in the merge
    changing_files=$(git diff --name-only "$merge_base" "$target_branch")

    # Create a temporary directory for backups
    tmp_dir=$(mktemp -d)
    protect_list=""

    # Check which protected files will be changed
    while read -r file; do
        if echo "$changing_files" | grep -q "^${file}$"; then
            mkdir -p "$(dirname "$tmp_dir/$file")"
            cp "$file" "$tmp_dir/$file"
            protect_list="$protect_list$file"$'\n'
        fi
    done <<< "$protected_files"

    # Save the list of files we actually need to protect
    echo "$protect_list" > "$tmp_dir/protected_files.txt"
fi

# Perform the merge
git merge "$target_branch" "$@"
merge_status=$?

if [ -f "$tmp_dir/protected_files.txt" ] && [ "$merge_status" -eq 0 ]; then
    # Check if we have any files to restore
    if [ -s "$tmp_dir/protected_files.txt" ]; then
        while read -r file; do
            [ -z "$file" ] && continue
            echo "→ $file"
            cp "$tmp_dir/$file" "$file"
            git add "$file"
        done < "$tmp_dir/protected_files.txt"
        git commit --amend --no-edit

        # After restoring all protected files, check if there are any differences
        if [ -z "$(git diff HEAD^ HEAD --name-only)" ]; then
            echo "No changes after restoring protected files. Cancelling merge."
            git reset --hard HEAD^
            merge_status=1
        fi
    fi
    rm -rf "$tmp_dir"
fi

exit $merge_status
EOF

chmod +x .git/protect-merge

# Create a Git alias
git config --local alias.protect-merge '!.git/protect-merge'

echo "Protected merge command has been set up successfully."
echo "Usage git protect-merge <branch> --no-ff"
