#!/bin/bash
set -e

rm -rf out/build
mkdir -p out/build

cp index.html out/build/.
cp index.js out/build/.
cp style.css out/build/.
cp -r assets out/build/assets
cp -r lib out/build/.
pushd out/build
find . -name "*.ts" | xargs -n 1 rm
find . -name "*.md" | xargs -n 1 rm
find . -name "*.snap" | xargs -n 1 rm
popd
