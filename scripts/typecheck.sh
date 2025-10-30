#!/bin/bash

# Type checking script for complex-geo-visualisations
# Runs TypeScript compiler in check-only mode (no output)
#
# Usage:
#   ./typecheck.sh                    - Check all configs
#   ./typecheck.sh <file-path>        - Check specific file with appropriate config

set -e

# If a file path is provided, run tsc on just that file's config
if [ $# -eq 1 ]; then
  FILE_PATH="$1"

  # Convert to absolute path if relative
  if [[ "$FILE_PATH" != /* ]]; then
    FILE_PATH="$(cd "$(dirname "$FILE_PATH")" && pwd)/$(basename "$FILE_PATH")"
  fi

  # Determine which jsconfig to use based on file path
  if [[ "$FILE_PATH" == *"/lib/app/"* ]]; then
    CONFIG="lib/app/jsconfig.json"
  elif [[ "$FILE_PATH" == *"/lib/prelude/"* ]]; then
    CONFIG="lib/prelude/jsconfig.json"
  elif [[ "$FILE_PATH" == *"/lib/ui/"* ]]; then
    CONFIG="lib/ui/jsconfig.json"
  elif [[ "$FILE_PATH" == *"/lib/base/"* ]]; then
    CONFIG="lib/base/jsconfig.json"
  else
    CONFIG="jsconfig.entry.json"
  fi

  # Run tsc with the determined config
  npx tsc -p "$CONFIG" --noEmit
  exit $?
fi

# No arguments: run full check on all configs
echo "Running type checking..."

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Create output directory for TypeScript declarations
mkdir -p out/tsc/lib
mkdir -p out/tsc/lib/{ui,app,base}

# Run TypeScript compiler with project references
npx tsc --build tsconfig.json

echo '✅ type checking complete'
