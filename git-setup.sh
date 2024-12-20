#!/bin/bash

# First, clean up any existing configurations
git config --local --remove-section merge.keep-ours 2>/dev/null || true

# Create a post-merge hook
cat >.husky/post-merge <<'EOF'
#!/bin/bash

# Get the previous HEAD before merge
previous_head=$(git rev-parse ORIG_HEAD)
current_head=$(git rev-parse HEAD)

# Get list of protected files
protected_files=$(git ls-files | git check-attr merge --stdin | grep "merge: keep-ours" | cut -d: -f1)

# Get files changed in the merge
changed_files=$(git diff --name-only $previous_head $current_head)

echo "Previous HEAD: $previous_head"
echo "Current HEAD: $current_head"
echo "Changed files: $changed_files"

# Reset protected files that were changed
needs_commit=false
echo "$protected_files" | while read -r file; do
    if echo "$changed_files" | grep -q "^${file}$"; then
        echo "Resetting protected file: $file"
        # Get the content from the previous commit
        git show "$previous_head:$file" > "$file"
        git add "$file"
        needs_commit=true
    fi
done

# If we made any changes, create a new commit
if [ "$needs_commit" = true ]; then
    echo "Creating new commit for protected files"
    git commit -m "fix: restore protected files after merge"
fi

EOF

chmod +x .husky/post-merge

echo "Git post-merge hook has been set up successfully!"
echo
echo "Protected files (from .gitattributes):"
git ls-files | git check-attr merge --stdin | grep "merge: keep-ours" || true
echo
echo "To test the configuration:"
echo "1. Make sure you're on your feature branch"
echo "2. Run: git merge main"
