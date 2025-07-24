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

# Run TypeScript compiler in check-only mode
npx tsc --noEmit -p ./jsconfig.json

echo "✓ Type checking completed successfully"
