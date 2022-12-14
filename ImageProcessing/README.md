# Pipeline for Object Detection 

we are considering between these 2 models 

1. Faster-RCNN by ShaoqingRen https://github.com/ShaoqingRen/faster_rcnn
2. Detr by Facebook https://huggingface.co/facebook/detr-resnet-50


# DETR

## Inference
<hr>
to run inference.py you need

```shelll
pip install -r inference.txt
```

optional
- CUDA installed

run
```shell
python inference.py --mode webcam --model_name detr_model_11cls_50ep
```

## Performance
<hr>
**2 ~ 3** fps on CUDA <br> 
**0.2** fps without CUDA

inference on <br>
```
Intel I5-9300H GTX-1650 2.40GHz SSD 16gb 4c-8th
```

