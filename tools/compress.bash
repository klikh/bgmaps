#!/bin/bash
output=$1
if [ -z $output ]
then
  echo "No output dir specified"
  exit 1
fi

rm -rf $output
mkdir -p $output
cp -r index.html event.html changelist.txt jquery-1.3.2.min.js img css results points $output

cat js/*.js >> $output/_script.js

java -jar tools/yuicompressor-2.4.2.jar --charset UTF-8 $output/_script.js > $output/script.js
rm $output/_script.js

tools/sedml.sh $output/event.html 's/<!-- JAVASCRIPTS_BEGIN .* JAVASCRIPTS_END -->/  <script src="jquery-1.3.2.min.js" type="text\/javascript"><\/script>\
  <script src="http:\/\/maps.google.com\/maps\?file=api\&amp\;v=2\&amp\;sensor=false\&amp\;key=ABQIAAAAgviLovAtMLUj4bsG5hDQfhTQtjlvjkD_s50C9vfU31409gl63RSBJPEyRgjnnFAxLpKOM-uD_kHVqg" type="text\/javascript"><\/script>\
  <script src="script.js" type="text\/javascript"><\/script>/'