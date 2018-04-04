#!/usr/bin/env bash
SCRIPT_DIR=$(cd $(dirname $0);pwd)
BASE_DIR=${SCRIPT_DIR}/..
DIST_DIR=${BASE_DIR}/dist


# create dist directory
mkdir -p ${DIST_DIR} 2>/dev/null

# copy files
cp ${BASE_DIR}/index.html.format ${DIST_DIR}/index.html
cp -R ${BASE_DIR}/js ${DIST_DIR}
cp -R ${BASE_DIR}/node_modules ${DIST_DIR}
cp -R ${BASE_DIR}/build ${DIST_DIR}

# change index.html
sed -i -e "s|{BASE_URL}|${BASE_URL}|g" ${DIST_DIR}/index.html
sed -i -e "s|{CONTRACT_ADDR}|${CONTRACT_ADDR}|g" ${DIST_DIR}/index.html
