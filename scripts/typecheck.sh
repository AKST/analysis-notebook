#!/bin/bash

# Type checking script for complex-geo-visualisations
# Runs TypeScript compiler in check-only mode (no output)

set -e

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
npx tsc -p lib/base/jsconfig.json --noEmit
npx tsc -p lib/ui/jsconfig.json --noEmit
npx tsc -p lib/app/jsconfig.json --noEmit
npx tsc -p jsconfig.entry.json --noEmit

echo '✅ type checking complete'
