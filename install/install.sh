#!/bin/bash

## Installs Node.js (only Ubuntu) and NPM packages for project
## Under Ubuntu, will use bundled DEB package
## Under Mac OS X will ask to download the Node.js installer
## No Windows support at the moment
## Once Node.js and NPM are installed under /usr/local will install project npm dependencies
## Reads node version from NODE_VERSION

BASE_DIR="$( cd $( dirname $0 ) && pwd | awk '{gsub(/\/install/,"")}1' )"
NODE_VERSION="$( cat $BASE_DIR/install/NODE_VERSION )"

if [ ! -f /usr/local/bin/node ]; then
  echo "Node.js is not installed on yor system"
  if [ -d /home ]; then
    echo "You're using Linux. Shall I install the Ubuntu package? (yes/no)"
    read reply
    if [ "$reply" == "yes" -o "$reply" == "y" ]; then
      sudo dpkg -i $BASE_DIR/install/nodejs_$NODE_VERSION-1_i386.deb
    elif [ "$reply" == "no" -o "$reply" == "n" ]; then
      echo "Download and install Node.js for Linux from http://nodejs.org/dist/latest/node-v$NODE_VERSION.tar.gz"
      read -p "Once Node.js is installed, press any key to continue..." -n1 -s
    else
      echo "Invalid choice... exiting"
      exit 1
    fi
  elif [ -d /Volumes ]; then
    echo "Your're using Mac OS X"
    echo "Download and install Node.js from http://nodejs.org/dist/latest/node-v$NODE_VERSION.pkg"
    read -p "Once Node.js is installed, press any key to continue..." -n1 -s
  fi
fi

if [ ! -f /usr/local/bin/npm ]; then
    echo "Shall I NPM?"
    read reply
    if [ "$reply" == "yes" -o "$reply" == "y" ]; then
      curl http://npmjs.org/install.sh | sh
    elif [ "$reply" == "no" -o "$reply" == "n" ]; then
      echo "Download and install npm from http://npmjs"
      read -p "Once npm is installed, press any key to continue..." -n1 -s
    else
      echo "Invalid choice... exiting"
      exit 1
    fi
fi
cd $BASE_DIR
npm -d install
