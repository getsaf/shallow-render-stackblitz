#!/bin/sh
set -e
rm -rf shallow-render
BRANCH=${1:-master}
echo "Using branch: ${BRANCH}"
git clone --single-branch --branch ${BRANCH} https://github.com/getsaf/shallow-render.git

rm -rf examples
cp -r ./shallow-render/lib/examples .
for spec in ./examples/*.spec.ts
do
  echo "import './$(basename ${spec%.*})';" >> examples/index.ts
done

sed -i '' "s/import {.*Shallow.*} from .*;/import { Shallow } from 'shallow-render';/" ./examples/*.spec.ts
npm i shallow-render@next
