#!/usr/bin/env bash

JS_DEV="src/js-dev"
JS_PROD="src/js"
JS_PROD_MIN="src/js-min"

# Clear prod and min directories.
rm ${JS_PROD}/*
rm ${JS_PROD_MIN}/*

# Use babel to compile ES6 JS code to ES5.
./node_modules/.bin/babel ${JS_DEV} -d ${JS_PROD}

# Use browserify to expand "require" commands, then use uglifyjs
# to compress result js files.
for file in ${JS_PROD}/*.js
do
  # Only need filename after last slash.
  filename="${file##*/}"
  browserify ${JS_PROD}/${filename} | uglifyjs -c -o ${JS_PROD_MIN}/${filename%.*}.min.${filename#*.}
done
