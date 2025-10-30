#!/bin/bash
set -e

find ./lib/app/sec-unsw \
  \( -path "*/sec-*/sec-*/*.ts" -o \
     -path "*/sec-*/sec-*/*.js" ! -path "*/sec-*/prelude.js" \) \
  -type f \
  -exec sed -i '' "s|'../../../prelude|'@app/prelude|g" {} \;

find ./lib/app/sec-textbook \
  \( -path "*/sec-*/sec-*/index.js" \) \
  -type f \
  -exec sed -i '' "s|'../../../../prelude|'@app/prelude|g" {} \;

find ./lib/app/sec-research \
  \( -path "*/sec-*/sec-*/index.js" \) \
  -type f \
  -exec sed -i '' "s|'../../../prelude|'@app/prelude|g" {} \;

find ./lib/app/sec-paper \
  \( -path "*/sec-*/sec-*/index.js" \) \
  -type f \
  -exec sed -i '' "s|'../../prelude|'@app/prelude|g" {} \;

