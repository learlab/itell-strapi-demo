#!/bin/bash

# Create a custom git command for protected merge
cat >.git/protect-merge <<'EOF'
#!/bin/bash

# Function to print section header
print_header() {
    echo
    echo "=== $1 ==="
}

# Get the merge base to check what will change
merge_base=$(git merge-base HEAD "$1")
target_branch="$1"
shift  # Remove the first argument (branch name) but keep other args like --no-ff

# Get list of protected files
protected_files=$(git ls-files | git check-attr merge --stdin | grep "merge: keep-ours" | cut -d: -f1)

if [ -n "$protected_files" ]; then
    # Get files that will change in the merge
    changing_files=$(git diff --name-only "$merge_base" "$target_branch")

    print_header "Files that will change in merge"
    echo "$changing_files"

    # Create a temporary directory for backups
    tmp_dir=$(mktemp -d)

    # Initialize an empty list for files that need protection
    protect_list=""

    print_header "Protected files that will be backed up"
    # Check which protected files will be changed
    while read -r file; do
        if echo "$changing_files" | grep -q "^${file}$"; then
            echo "→ $file"
            mkdir -p "$(dirname "$tmp_dir/$file")"
            cp "$file" "$tmp_dir/$file"
            protect_list="$protect_list$file"$'\n'
        fi
    done <<< "$protected_files"

    # Save the list of files we actually need to protect
    echo "$protect_list" > "$tmp_dir/protected_files.txt"
fi

print_header "Performing merge"
# Perform the merge
git merge "$target_branch" "$@"
merge_status=$?

if [ -f "$tmp_dir/protected_files.txt" ] && [ "$merge_status" -eq 0 ]; then
    # Check if we have any files to restore
    if [ -s "$tmp_dir/protected_files.txt" ]; then
        print_header "Restoring protected files"
        while read -r file; do
            # Skip empty lines
            [ -z "$file" ] && continue
            echo "→ $file"
            cp "$tmp_dir/$file" "$file"
            git add "$file"
        done < "$tmp_dir/protected_files.txt"

        # Amend the merge commit
        print_header "Amending merge commit"
        git commit --amend --no-edit
    else
        print_header "Status"
        echo "No protected files were modified in merge"
    fi

    # Clean up
    rm -rf "$tmp_dir"
fi

exit $merge_status
EOF

chmod +x .git/protect-merge

# Create a Git alias
git config --local alias.protect-merge '!.git/protect-merge'

echo "Protected merge command has been set up!"
echo
echo "To merge with protected files:"
echo "git protect-merge main [--no-ff]"
echo
echo "Protected files (from .gitattributes):"
git ls-files | git check-attr merge --stdin | grep "merge: keep-ours" || true
