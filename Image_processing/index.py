import os
import sys
import pickle

os.environ["KMP_DUPLICATE_LIB_OK"]="TRUE"
import json

sys.path.append("./image_processing")

from libs.inference import SnacksDetection
from libs.model import Detr, CocoDetection

from transformers import DetrFeatureExtractor, DetrForObjectDetection
import torch


device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

print("Running on", device)

class CustomUnpickler(pickle.Unpickler):
    
    def find_class(self, module, name):
        if name == 'Detr':
            return Detr
        return super().find_class(module, name)


def load_model(path):
    # with open(path, 'rb') as f:
        # unpickler = CustomUnpickler(f)
    # _model = torch.load(f, pickle_module = unpickler, map_location=device)
    _model = torch.load(path, map_location=device)
    _model.eval()
    _model.to(device)
    return _model

def get_model(model_name):

    model_name = model_name

    if model_name:
        model_path = f"./image_processing/models/state/{model_name}.pt"
        label_path = f"./image_processing/models/state/{model_name}.json"
    else:
        raise Exception("model name is invalid")

    model = load_model(model_path)
    feature_extractor = DetrFeatureExtractor.from_pretrained("facebook/detr-resnet-50")

    with open(label_path) as raw:
        # load label and convert key to int
        labels = json.load(raw)
        labels = { int(k) : labels[k] for k in labels}

        SD = SnacksDetection(model, feature_extractor, labels)
    
    return SD
