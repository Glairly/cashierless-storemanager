# How to

1. install all required dependencies

```
pip install -r requirements.txt
```

2. run train with a following required args

```
python train_detr.py \
    --dataset_path default_to_/snack-version \
    --ckpt_path path_to_checkpoint \
    --batch_size batch_size \
    --epochs epochs \
    --roboflow_version number \
    --gpu_devices number \
    --download_dataset true/false
```

```
python train_detr.py \
    --epochs 0 \
    --roboflow_version 2 \
    --download_dataset true
```

3. waiting...