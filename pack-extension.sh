#!/bin/bash

set -e

cd "$(dirname "$0")"

# Get version from package.json
VERSION=$(node -p "require('./package.json').version")

ZIP_NAME="google-flights-preference-setter-v$VERSION.zip"

rm -f "$ZIP_NAME"

zip -r "$ZIP_NAME" dist -x "*/\.*" -x "__MACOSX"

echo "✅ $ZIP_NAME created!"