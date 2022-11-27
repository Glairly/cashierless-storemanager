from transformers import DetrFeatureExtractor, DetrForObjectDetection
import os
import sys
from torch.utils.data import DataLoader
from roboflow import Roboflow
from pytorch_lightning.callbacks import ModelCheckpoint
from pytorch_lightning import Trainer
from absl import app
from absl import flags
import json



sys.path.insert(0,f"{os.getcwd()}")

from libs.model import CocoDetection
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

    feature_extractor = DetrFeatureExtractor.from_pretrained("facebook/detr-resnet-50")
    train_dataset = CocoDetection(img_folder=f'{dataset_path}/train', feature_extractor=feature_extractor)
    val_dataset = CocoDetection(img_folder=f'{dataset_path}/valid', feature_extractor=feature_extractor)

    cats = train_dataset.coco.cats
    id2label = {k: v['name'] for k,v in cats.items()}

    print("Number of training examples:", len(train_dataset))

    # epochs = epochs * (len(train_dataset) / 4 + len(val_dataset) / 2) 

    def collate_fn(batch):
        pixel_values = [item[0] for item in batch]
        encoding = feature_extractor.pad_and_create_pixel_mask(pixel_values, return_tensors="pt")
        labels = [item[1] for item in batch]
        batch = {}
        batch['pixel_values'] = encoding['pixel_values']
        batch['pixel_mask'] = encoding['pixel_mask']
        batch['labels'] = labels
        return batch

    train_dataloader = DataLoader(train_dataset, collate_fn=collate_fn, batch_size=batch_size, shuffle=True)
    val_dataloader = DataLoader(val_dataset, collate_fn=collate_fn, batch_size=batch_size, shuffle=True)



    # Model Preperation
    class Detr(pl.LightningModule):
        
        def __init__(self, lr, lr_backbone, weight_decay):
            super().__init__()
            # replace COCO classification head with custom head
            self.model = DetrForObjectDetection.from_pretrained("facebook/detr-resnet-50", 
                                                                num_labels=len(id2label),
                                                                ignore_mismatched_sizes=True)
            # see https://github.com/PyTorchLightning/pytorch-lightning/pull/1896
            self.lr = lr
            self.lr_backbone = lr_backbone
            self.weight_decay = weight_decay

        def forward(self, pixel_values, pixel_mask):
            outputs = self.model(pixel_values=pixel_values, pixel_mask=pixel_mask)

            return outputs
        
        def common_step(self, batch, batch_idx):
            pixel_values = batch["pixel_values"]
            pixel_mask = batch["pixel_mask"]
            labels = [{k: v.to(self.device) for k, v in t.items()} for t in batch["labels"]]

            outputs = self.model(pixel_values=pixel_values, pixel_mask=pixel_mask, labels=labels)

            loss = outputs.loss
            loss_dict = outputs.loss_dict

            return loss, loss_dict

        def training_step(self, batch, batch_idx):
            loss, loss_dict = self.common_step(batch, batch_idx)     
            # logs metrics for each training_step,
            # and the average across the epoch
            self.log("training_loss", loss)
            for k,v in loss_dict.items():
                self.log("train_" + k, v.item())

            return loss

        def validation_step(self, batch, batch_idx):
            loss, loss_dict = self.common_step(batch, batch_idx)     
            self.log("validation_loss", loss)
            for k,v in loss_dict.items():
                self.log("validation_" + k, v.item())

            return loss

        def configure_optimizers(self):
            param_dicts = [
                {"params": [p for n, p in self.named_parameters() if "backbone" not in n and p.requires_grad]},
                {
                    "params": [p for n, p in self.named_parameters() if "backbone" in n and p.requires_grad],
                    "lr": self.lr_backbone,
                },
            ]
            optimizer = torch.optim.AdamW(param_dicts, lr=self.lr,
                                    weight_decay=self.weight_decay)
            
            return optimizer

        def train_dataloader(self):
            return train_dataloader

        def val_dataloader(self):
            return val_dataloader

    model = Detr(lr=1e-4, lr_backbone=1e-5, weight_decay=1e-4)
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
    # torch.save(model, filename)

    LABEL_PATH = f"{filename}.json"

    with open(LABEL_PATH, "w") as outfile:
        json.dump(id2label, outfile)



    print("Done")
    print("Model saved to " + filename)



if __name__ == "__main__":
    app.run(main)