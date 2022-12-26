#!/usr/bin/env sh

set - e

npm run build

cd dist

git init 

git add .

git commit -m "deploy"

git push  https://github.com/Gennadiy5146152/moire.git main

cd -