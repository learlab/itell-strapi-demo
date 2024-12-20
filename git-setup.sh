#!/bin/bash

# Clean up any existing configurations
git config --local --remove-section merge.keep-ours 2>/dev/null || true

# Set up merge driver
cat >.git/keep-ours-merge-driver.sh <<'EOF'
#!/bin/bash
# Just keep our version by exiting
exit 0
EOF
chmod +x .git/keep-ours-merge-driver.sh

# Configure Git with merge driver
git config --local merge.keep-ours.name "always keep our version during merge"
git config --local merge.keep-ours.driver ".git/keep-ours-merge-driver.sh %O %A %B %P"

# Create a pre-commit hook to protect files during merge
cat >.husky/pre-commit <<'EOF'
#!/bin/bash

# Check if we're in a merge state
if [ -f .git/MERGE_HEAD ]; then
    echo "Merge in progress, checking protected files..."

    # Get list of protected files
    protected_files=$(git ls-files | git check-attr merge --stdin | grep "merge: keep-ours" | cut -d: -f1)

    if [ -n "$protected_files" ]; then
        # Get the commit we're merging from
        merge_head=$(cat .git/MERGE_HEAD)
        our_head=$(cat .git/HEAD)

        echo "$protected_files" | while read -r file; do
            if git diff --name-only $our_head $merge_head | grep -q "^${file}$"; then
                echo "Protecting $file from merge changes..."
                # Get our version of the file
                our_blob=$(git rev-parse $our_head:$file)
                # Write our version to the index
                git update-index --cacheinfo 100644,$our_blob,$file
                echo "Protected $file"
            fi
        done
    fi
fi

exit 0
EOF

chmod +x .husky/pre-commit

echo "Git configuration has been set up successfully!"
echo
echo "Protected files (from .gitattributes):"
git ls-files | git check-attr merge --stdin | grep "merge: keep-ours" || true
echo
echo "To test the configuration:"
echo "1. Make sure you're on your feature branch"
echo "2. Run: git merge main --no-ff"
