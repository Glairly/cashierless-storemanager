## Installation Dependencies

1. Anaconda
recommend using ``conda`` with python version exactly ``3.7.13`` 

```bash
conda create -n envname python=3.7.13
conda activate envname
```
2. CUDA 11.6
[here](https://developer.nvidia.com/cuda-11-6-0-download-archive)

3. Library
```bash
pip install -r requirements.txt
conda install pytorch torchvision torchaudio pytorch-cuda=11.6 -c pytorch -c nvidia
```
and also install database we are using ``mongodb`` here

## To serve 

create a configuration file beside ``app.py`` level as ``config.json`` that contains something like
```json
{
    "mongoClientURL": "mongodb://localhost:27017/",
    "dbName": "cashierless"
}
```

### Download model weight

=> [here](https://drive.google.com/drive/u/1/folders/1UC5hN7XFMqM7JdM_itv9dfEzj1l9YEE3)
-------------------------
```bash
detr_model-11cls-50pt.pt
detr_model-11cls-50ep_label.json
```
put these 2 files in the ```object_detection/models``` directory 

### and run this

```bash
# In /backend
uvicorn --app-dir=fastapi app:app --reload  
```

app should be served on: https://localhost:8000

for swagger: https://localhost:8000/docs