#!/bin/bash

# Create merge driver script
cat >.git/keep-ours-merge-driver.sh <<'EOF'
#!/bin/bash
touch "$2"
exit 0
EOF
chmod +x .git/keep-ours-merge-driver.sh

# Configure Git
git config --local merge.keep-ours.name "always keep our version during merge"
git config --local merge.keep-ours.driver ".git/keep-ours-merge-driver.sh %O %A %B %P"

# Create pre-merge hook
cat >.husky/pre-merge-commit <<'EOF'
#!/bin/bash
# Get the current branch
current_branch=$(git rev-parse --abbrev-ref HEAD)

# List of protected files (can be moved to a separate config file)
protected_patterns=$(git config --get-all merge.keep-ours.driver | while read -r line; do
  git check-attr merge -- * | grep "merge: keep-ours" | cut -d: -f1
done)

# Check each changed file
changed_files=$(git diff --name-only ORIG_HEAD HEAD)
for file in $changed_files; do
  if echo "$protected_patterns" | grep -q "^${file}$"; then
    if ! git diff --quiet ORIG_HEAD HEAD -- "$file"; then
      echo "Notice: Protected file $file keeping current branch version"
      git checkout HEAD -- "$file"
    fi
  fi
done

exit 0
EOF

echo "Git configuration for protected files has been set up successfully!"
