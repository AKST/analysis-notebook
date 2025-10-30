#!/bin/bash
set -e

find ./lib/ui \
  \( -path "*/*.ts" -o -path "*/*.js"  \) -type f \
  -exec sed -i '' "s|'./../../base|'@base|g" {} \;


