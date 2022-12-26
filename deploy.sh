#!/usr/bin/env sh

set - e

npm run build

cd dist

git add .

git commit -m "deploy"

git push origin main

cd -