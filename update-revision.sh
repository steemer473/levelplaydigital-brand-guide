#!/bin/bash

# Script to update revision number in brand guide
# Usage: ./update-revision.sh [major|minor|patch]

VERSION_FILE="VERSION"
HTML_FILE="index.html"

# Read current version
if [ ! -f "$VERSION_FILE" ]; then
    echo "1.0" > "$VERSION_FILE"
fi

CURRENT_VERSION=$(cat "$VERSION_FILE")
IFS='.' read -ra VERSION_PARTS <<< "$CURRENT_VERSION"
MAJOR=${VERSION_PARTS[0]}
MINOR=${VERSION_PARTS[1]}

# Determine increment type
INCREMENT_TYPE=${1:-patch}

case $INCREMENT_TYPE in
    major)
        MAJOR=$((MAJOR + 1))
        MINOR=0
        ;;
    minor)
        MINOR=$((MINOR + 1))
        ;;
    patch)
        MINOR=$((MINOR + 1))
        ;;
    *)
        echo "Usage: $0 [major|minor|patch]"
        exit 1
        ;;
esac

NEW_VERSION="${MAJOR}.${MINOR}"

# Update VERSION file
echo "$NEW_VERSION" > "$VERSION_FILE"

# Update HTML file - meta tag
sed -i '' "s/<meta name=\"revision\" content=\"[0-9.]*\">/<meta name=\"revision\" content=\"$NEW_VERSION\">/" "$HTML_FILE"

# Update HTML file - badge
sed -i '' "s/Revision [0-9.]*/Revision $NEW_VERSION/" "$HTML_FILE"

# Update HTML file - footer
sed -i '' "s/Brand Guide Revision: <strong>[0-9.]*<\/strong>/Brand Guide Revision: <strong>$NEW_VERSION<\/strong>/" "$HTML_FILE"

echo "✓ Revision updated from $CURRENT_VERSION to $NEW_VERSION"
echo "✓ Updated $HTML_FILE"
echo ""
echo "Next steps:"
echo "  git add VERSION index.html"
echo "  git commit -m \"Update brand guide to revision $NEW_VERSION\""
echo "  git push"

