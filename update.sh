#!/bin/sh
set -e
rm -rf shallow-render
git clone https://github.com/getsaf/shallow-render.git

rm -rf examples
cp -r ./shallow-render/projects/shallow-render/src/lib/examples .
for spec in ./examples/*.spec.ts
do
  echo "import './$(basename ${spec%.*})';" >> examples/index.ts
done

sed -i '' "s/import {.*Shallow.*} from .*;/import { Shallow } from 'shallow-render';/" ./examples/*.spec.ts
npm i -D shallow-render@latest
