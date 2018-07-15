#!/bin/sh
git submodule update

rm -rf examples
cp -r ./shallow-render/lib/examples .
for spec in ./examples/*.spec.ts
do
  echo "import './$(basename ${spec%.*})';" >> examples/index.ts
done

sed -i '' "s/import {.*Shallow.*} from .*;/import { Shallow } from 'shallow-render';/" ./examples/*.spec.ts

