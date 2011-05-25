#!/bin/bash
output=$1
if [ -z $output ]
then
  echo "No output dir specified"
  exit 1
fi
rm -rf $output
mkdir -p $output

echo "Copying unmodified files..."
cp -r index.html event.html changelist.txt img results points $output

echo "Merging js..."
# and adding newlines between files
find js -name *.js -exec cat {} \; -exec echo \; > $output/_script.js 
echo "Merging css..."
find css -name *.css -exec cat {} \; -exec echo \; > $output/_style.css

echo "Compressing js..."
java -jar tools/yuicompressor-2.4.2.jar --charset UTF-8 $output/_script.js > $output/script.js
echo "Compressing css..."
java -jar tools/yuicompressor-2.4.2.jar --charset UTF-8 $output/_style.css > $output/style.css
rm $output/_script.js $output/_style.css

echo "Modifying htmls to link right js and css..."

tools/sedml.sh $output/event.html 's/<!-- JAVASCRIPT_BEGIN .* JAVASCRIPT_END -->/  <script src="http:\/\/maps.google.com\/maps\?file=api\&amp\;v=2\&amp\;sensor=false\&amp\;key=ABQIAAAAgviLovAtMLUj4bsG5hDQfhTsGiFi_rGis_BT3KpfiM6EgD0bJBTMrCtDySuTkeI-LPu5HoVpyvfLPg" type="text\/javascript"><\/script>\
  <script src="script.js" type="text\/javascript"><\/script>/'
  
for html in `ls $output/*.html` 
do
  tools/sedml.sh $html 's/<!-- CSS_BEGIN .* CSS_END -->/  <link href="style.css" rel="stylesheet" type="text\/css" \/>/'
done

echo "Project is ready for upload."