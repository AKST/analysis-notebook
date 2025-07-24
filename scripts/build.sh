#!/bin/bash
set -e

rm -rf out
mkdir -p out

cp index.html out/.
cp index.js out/.
cp style.css out/.
cp -r assets out/assets
cp -r lib out/.
pushd out
find . -name "*.ts" | xargs -n 1 rm
find . -name "*.md" | xargs -n 1 rm
find . -name "*.snap" | xargs -n 1 rm
