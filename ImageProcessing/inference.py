from absl import app
from absl import flags
import os
import json

os.path.join(".")
from libs.inference import SnacksDetection
from libs.model import Detr

from transformers import DetrFeatureExtractor
import torch

flags.DEFINE_string(
    'model_path', None, 'Model path')
flags.DEFINE_string(
    'img_path', None, 'Image path')
flags.DEFINE_string(
    'label_path', None, 'Labels path')
flags.DEFINE_string(
    'mode', None, 'Prediction mode')

FLAGS = flags.FLAGS

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

def load_model(path):
    _model = torch.load(path, map_location=device)
    _model.eval()
    _model.to(device)
    return _model

def main(argv):

    model_path = FLAGS.model_path if FLAGS.model_path else "./models/state/default.pt"
    img_path = FLAGS.img_path if FLAGS.img_path else "./images/default.jpg"
    label_path = FLAGS.label_path if FLAGS.label_path else "./models/state/default_label.json"
    mode = FLAGS.mode if FLAGS.mode else 'image'

    model = load_model(model_path)
    feature_extractor = DetrFeatureExtractor.from_pretrained("facebook/detr-resnet-50")

    with open(label_path) as raw:
        # load label and convert key to int
        labels = json.load(raw)
        labels = { int(k) : labels[k] for k in labels}

        SD = SnacksDetection(model, feature_extractor,labels)

        if mode == 'webcam':
            SD.streams()
        elif mode == 'image':
            SD.predict(path_to_image=img_path)
        else:
            print("Mode is invalid.")

    pass

if __name__ == "__main__":
    app.run(main)