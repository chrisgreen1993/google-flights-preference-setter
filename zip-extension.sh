#!/bin/bash

set -e

cd "$(dirname "$0")"

rm -f google-flights-preference-setter.zip

zip -r google-flights-preference-setter.zip src manifest.json icons -x "*/\.*" -x "__MACOSX"

echo "✅ google-flights-preference-setter.zip created!"