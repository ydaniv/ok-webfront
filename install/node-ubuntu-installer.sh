#!/bin/sh
##############################################################
#
# Author: Ruslan Khissamov, email: rrkhissamov@gmail.com
#
# Thank you: Alexey Kupershtokh
#
# Installs Node.js & NPM on Ubuntu from source
# Creates a DEB package under /usr/local/src/node_install
# Reads Node.js version to use from NODE_VERSION
#
##############################################################

# Update System
BASE_DIR="$( cd $( dirname $0 ) && pwd | awk '{gsub(/\/install/,"")}1' )"
NODE_VERSION="$( cat $BASE_DIR/install/NODE_VERSION )"

echo 'System Update'
apt-get -y update
echo 'Update completed'
# Install help app
apt-get -y install libssl-dev git-core pkg-config build-essential curl gcc g++
# Download & Unpack Node.js
echo "Download Node.js - v. $NODE_VERSION"
mkdir /usr/local/src/node-install
cd /usr/local/src/node-install
wget "http://nodejs.org/dist/latest/node-v$NODE_VERSION.tar.gz"
tar -zxf "node-v$NODE_VERSION.tar.gz"
echo 'Node.js download & unpack completed'
# Install Node.js
echo 'Install Node.js'
cd "node-v$NODE_VERSION"
./configure && make && checkinstall --install=yes --pkgname=nodejs --pkgversion "$NODE_VERSION" --default
echo 'Node.js install completed'
