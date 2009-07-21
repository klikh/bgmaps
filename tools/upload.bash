#!/bin/bash
version=$1
if [ -z $version ]
then
  echo "No version specified"
  exit 1
fi

source=~/workspace/bgmaps/upload/$version

ssh stokomracn@77.222.40.87 "rm -rf mkdir -p /home/s/stokomracn/bgmaps/versions/$version; ln -s /home/s/stokomracn/bgmaps/versions/$version /home/s/stokomracn/bgmaps/$version"
scp -r $source/* stokomracn@77.222.40.87:/home/s/stokomracn/bgmaps/versions/$version
