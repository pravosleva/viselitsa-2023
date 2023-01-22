#!/bin/bash

source ./read-env.sh

LOCAL_TARGET_PATH_BUILD_DIR=$(read_env LOCAL_TARGET_PATH_BUILD_DIR .env.prod.local)

echo '-- DEPLOY STARTED' &&

srcDir=$PWD/

rsync -av --delete dist.viselitsa-2023/ $LOCAL_TARGET_PATH_BUILD_DIR &&
rsync -r $srcDir/index.html $LOCAL_TARGET_PATH_BUILD_DIR &&

echo '-- DEPLOY COMPLETED'
