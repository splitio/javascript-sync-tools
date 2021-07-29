#!/bin/bash

# replace splitio-commons imports to use ES modules
replace '@splitsoftware/splitio-commons/src' '@splitsoftware/splitio-commons/esm' ./lib/esm -r

if [ $? -eq 0 ]
then
  echo "{ \"type\": \"module\" }" > lib/esm/package.json
  exit 0
else
  exit 1
fi
