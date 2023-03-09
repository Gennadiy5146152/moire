#!/usr/bin/env sh

set - e

npm run build

cp -r dist/ docs/

cd docs

git add .

git commit -m "deploy"

git push origin main

cd -