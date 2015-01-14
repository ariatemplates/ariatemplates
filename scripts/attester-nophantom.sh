#!/bin/bash

runAttester() {
  node node_modules/attester/bin/attester.js test/attester-nophantom.yml --env package.json --phantomjs-instances 0 --robot-browser "$@"
}

if [ "$TRAVIS" = "true" ]; then
  runAttester "Firefox"
fi

runAttester "Chrome"
