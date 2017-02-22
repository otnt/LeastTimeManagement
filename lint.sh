#!/usr/bin/env bash

JS_DEV="src/js-dev"

for file in ${JS_DEV}/*.js
do
  ./node_modules/.bin/eslint ${file}
done
