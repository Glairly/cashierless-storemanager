#!/bin/bash

#SBATCH -A raweerojt
#SBATCH --job-name=train-detr
#SBATCH -N 1 --ntasks-per-node=30
#SBATCH --gres=gpu:2
#SBATCH -t 8:00:00
#SBATCH  --mem=60G 
#SBATCH -o out_%j.txt
#SBATCH -e err_%j.txt

source glairly/bin/activate
chmod +x install.sh
./install.sh

python3 ./train_detr.py \
    --epochs 100 \
    --roboflow_version 2 \
    --gpu_devices 2 \
    --download_dataset true \