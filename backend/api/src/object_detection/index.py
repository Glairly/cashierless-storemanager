import os
os.environ["KMP_DUPLICATE_LIB_OK"]="TRUE"

import torch
import json

from .SnackDetection import SnacksDetection
from transformers import DetrFeatureExtractor

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print("Now Running on", device)

def load_model(path):
    _model = torch.load(path, map_location=device)
    _model.eval()
    _model.to(device)
    return _model

def get_model(model_name):
    assert model_name, "model_name is invalid"

    model_path = f"{os.getcwd()}/api/src/object_detection/models/{model_name}.pt"
    label_path = f"{os.getcwd()}/api/src/object_detection/models/{model_name}.json"

    model = load_model(model_path)
    feature_extractor = DetrFeatureExtractor.from_pretrained("facebook/detr-resnet-50")
    with open(label_path) as raw:
        # load label and convert key to int
        labels = json.load(raw)
        labels = { int(k) : labels[k] for k in labels}
    
    return SnacksDetection(model, feature_extractor, labels)
