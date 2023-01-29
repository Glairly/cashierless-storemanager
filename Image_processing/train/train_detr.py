import os
import sys
from roboflow import Roboflow
from pytorch_lightning.callbacks import ModelCheckpoint
from pytorch_lightning import Trainer
from absl import app
from absl import flags
import json

sys.path.insert(0,f"{os.getcwd()}")

from libs.model import Detr
import torch
import pytorch_lightning as pl


rf = Roboflow(api_key="AYEg9VSfc2eDUkVs7wXy")
project = rf.workspace("school-czl2e").project("snacks-xz9tx")

flags.DEFINE_string(
    'dataset_path', None, 'Dataset Path absolute path or default to roboflow directory')
flags.DEFINE_string(
    'ckpt_path', None, 'Path where the checkpoint will be stored.')
flags.DEFINE_string(
    'batch_size', None, 'Batch size')
flags.DEFINE_string(
    'epochs', None, 'Epochs')
flags.DEFINE_string(
    'roboflow_version', None, 'Roboflow Dataset Version')
flags.DEFINE_string(
    'gpu_devices', None, 'GPU nums')
flags.DEFINE_string(
    'download_dataset', None, 'Download_dataset or not?')

FLAGS = flags.FLAGS

def main(argv):
    del argv

    roboflow_version = FLAGS.roboflow_version if FLAGS.roboflow_version else 0
    dataset_path = FLAGS.dataset_path if FLAGS.dataset_path else "./snacks-" + str(roboflow_version)
    ckpt_path = FLAGS.ckpt_path if FLAGS.ckpt_path else  os.getcwd() + "\\models\\ckpt\\"
    batch_size = FLAGS.batch_size if FLAGS.batch_size else 4
    epochs = FLAGS.epochs if FLAGS.epochs else 50
    gpu_devices = FLAGS.gpu_devices if FLAGS.gpu_devices else 0
    download_dataset = FLAGS.download_dataset if FLAGS.download_dataset else False

    model_path = os.getcwd() + "\\models\\state\\"


    try:
        roboflow_version = int(roboflow_version)
        batch_size = int(batch_size)
        epochs = int(epochs)
        gpu_devices = int(gpu_devices)
    except:
        raise Exception("Invalid number input.") 

    # Data Preperation
    ## download data
    if download_dataset == 'True' or download_dataset == 'true' or download_dataset == 'y':
        try:
            project.version(roboflow_version).download("coco")
        except:
            raise Exception("Cannot download data from roboflow")

    # Model Preperation
    model = Detr(lr=1e-4, lr_backbone=1e-5, weight_decay=1e-4)
    model.preprocess(dataset_path=dataset_path, epochs=epochs)

    epochs = model.get_epochs()

    ckpt = ModelCheckpoint(dirpath=ckpt_path, filename='detr-{epoch}eps' )

    
    if gpu_devices == 0:
        trainer = Trainer(callbacks=[ckpt], max_steps=epochs, gradient_clip_val=0.1)
    else:
        trainer = Trainer(callbacks=[ckpt], accelerator='gpu', devices=gpu_devices, max_steps=epochs, gradient_clip_val=0.1)

    # Training
    trainer.fit(model)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)

    filename = f"{model_path}detr-{epochs}eps.pt"

    print(filename)
    torch.save(model, filename)

    LABEL_PATH = f"{filename}.json"
    cats = model.get_cats()

    with open(LABEL_PATH, "w") as outfile:
        json.dump(cats, outfile)

    print("Done")
    print("Model saved to " + filename)



if __name__ == "__main__":
    app.run(main)