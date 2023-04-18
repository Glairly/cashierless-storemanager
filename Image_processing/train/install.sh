#!/bin/bash

# Update package lists and install dependencies
sudo apt-get update
sudo apt-get install --no-install-recommends -y curl gcc zbar-tools build-essential cmake

# Install Cython
sudo pip install cython

# Install Python packages from requirements.txt
sudo pip install -r requirements.txt

# Install COCO API
sudo pip install git+https://github.com/philferriere/cocoapi.git#subdirectory=PythonAPI