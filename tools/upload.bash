#!/bin/bash
version=$1
if [ -z $version ]
then
  echo "No version specified"
  exit 1
fi

source=~/workspace/bgmaps/upload/$version
bgmaps=/home/s/stokomracn/bgmaps

ssh stokomracn@77.222.40.87 "rm -rf $bgmaps/public_html; rm -rf $bgmaps/versions/$version; mkdir -p $bgmaps/versions/$version; ln -s $bgmaps/versions/$version $bgmaps/public_html"
scp -r $source/* stokomracn@77.222.40.87:$bgmaps/versions/$version
