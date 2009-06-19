#!/bin/bash
output=$1
if [ -z $output ]
then
  echo "No output dir specified"
  exit 1
fi

rm -rf $output
mkdir -p $output
cp index.html *.png changelist.txt put_points.html $output

JSFILES="points.js
results.js
util.js
bdccArrowedPolyline.js
labeledmarker.js
main.js"

for file in $JSFILES
do
  cat $file >> $output/_script.js
done

java -jar yuicompressor-2.4.2.jar --charset UTF-8 $output/_script.js > $output/script.js
rm $output/_script.js

./sedml.sh $output/index.html 's/<!-- JAVASCRIPTS_BEGIN .* JAVASCRIPTS_END -->/  <script src="http:\/\/maps.google.com\/maps\?file=api\&amp\;v=2\&amp\;sensor=false\&amp\;key=ABQIAAAAgviLovAtMLUj4bsG5hDQfhTQtjlvjkD_s50C9vfU31409gl63RSBJPEyRgjnnFAxLpKOM-uD_kHVqg" type="text\/javascript"><\/script>\
  <script src="script.js" type="text\/javascript"><\/script>/'

sed -i -e 's/<script.*<\/script>/  <script src="http:\/\/maps.google.com\/maps\?file=api\&amp\;v=2\&amp\;sensor=false\&amp\;key=ABQIAAAAgviLovAtMLUj4bsG5hDQfhTQtjlvjkD_s50C9vfU31409gl63RSBJPEyRgjnnFAxLpKOM-uD_kHVqg" type="text\/javascript"><\/script>/' $output/put_points.html
  
java -jar yuicompressor-2.4.2.jar --charset UTF-8 -v main.css > $output/main.css