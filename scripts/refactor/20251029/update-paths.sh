#!/bin/bash
set -e

find ./lib/app/sec-unsw \
  \( -path "*/sec-*/prelude.js" \) \
  -type f \
  -exec sed -i '' "s|'../../base/preludes|'../../../base/preludes|g" {} \;

find ./lib/app/sec-unsw \
  \( -path "*/sec-*/sec-*/*.ts" -o \
     -path "*/sec-*/sec-*/*.js" ! -path "*/sec-*/prelude.js" \) \
  -type f \
  -exec sed -i '' "s|'../../prelude|'../../../prelude|g" {} \;

find ./lib/app/sec-textbook \
  \( -path "*/sec-*/sec-*/index.js" \) \
  -type f \
  -exec sed -i '' "s|'../../../prelude|'../../../../prelude|g" {} \;

