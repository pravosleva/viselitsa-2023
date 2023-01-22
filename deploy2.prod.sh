#!/bin/bash

source ./read-env.sh

PROD_TARGET_PATH_BUILD_DIR=$(read_env PROD_TARGET_PATH_BUILD_DIR .env.prod."$1")

echo '-- DEPLOY STARTED: PROD' &&

# srcDir=$PWD/

rsync -av --delete dist.local-prod/ $PROD_TARGET_PATH_BUILD_DIR &&

# rsync -r $srcDir/index.html $PROD_TARGET_PATH_BUILD_DIR &&

echo '-- DEPLOY COMPLETED'
