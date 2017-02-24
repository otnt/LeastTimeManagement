#!/usr/bin/env bash

JS_DEV="src/js"

for file in ${JS_DEV}/*.js
do
  ./node_modules/.bin/eslint ${file}
done
