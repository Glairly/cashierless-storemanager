import torchvision
import torch
import os
import pytorch_lightning as pl
from transformers import DetrForObjectDetection, DetrFeatureExtractor
from torch.utils.data import DataLoader

class CocoDetection(torchvision.datasets.CocoDetection):
    def __init__(self, img_folder, feature_extractor, train=True):
        ann_file = os.path.join(img_folder, "_annotations.coco.json")
        super(CocoDetection, self).__init__(img_folder, ann_file)
        self.feature_extractor = feature_extractor

    def __getitem__(self, idx):
        # read in PIL image and target in COCO format
        img, target = super(CocoDetection, self).__getitem__(idx)
        
        # preprocess image and target (converting target to DETR format, resizing + normalization of both image and target)
        image_id = self.ids[idx]
        target = {'image_id': image_id, 'annotations': target}
        encoding = self.feature_extractor(images=img, annotations=target, return_tensors="pt")
        pixel_values = encoding["pixel_values"].squeeze() # remove batch dimension
        target = encoding["labels"][0] # remove batch dimension

        return pixel_values, target

feature_extractor = DetrFeatureExtractor.from_pretrained("facebook/detr-resnet-50")
def collate_fn(batch):
    pixel_values = [item[0] for item in batch]
    encoding = feature_extractor.pad_and_create_pixel_mask(pixel_values, return_tensors="pt")
    labels = [item[1] for item in batch]
    batch = {}
    batch['pixel_values'] = encoding['pixel_values']
    batch['pixel_mask'] = encoding['pixel_mask']
    batch['labels'] = labels
    return batch

class Detr(pl.LightningModule):
        
        def __init__(self, lr, lr_backbone, weight_decay):
            super().__init__()
            # replace COCO classification head with custom head
            # self.model = DetrForObjectDetection.from_pretrained("facebook/detr-resnet-50", 
            #                                                     num_labels=len(id2label),
            #                                                     ignore_mismatched_sizes=True)
            self.model = None
            # see https://github.com/PyTorchLightning/pytorch-lightning/pull/1896
            self.lr = lr
            self.lr_backbone = lr_backbone
            self.weight_decay = weight_decay
        
        def preprocess(self, dataset_path):
            
            self.train_dataset = CocoDetection(img_folder=f'{dataset_path}/train', feature_extractor=feature_extractor)
            self.val_dataset = CocoDetection(img_folder=f'{dataset_path}/valid', feature_extractor=feature_extractor)

            cats = self.train_dataset.coco.cats
            self.id2label = {k: v['name'] for k,v in cats.items()}

            print("Number of training examples:", len(self.train_dataset))
            # epochs = epochs * (len(train_dataset) / 4 + len(val_dataset) / 2) 
            self.model = DetrForObjectDetection.from_pretrained("facebook/detr-resnet-50", 
                                                                num_labels=len(self.id2label),
                                                                ignore_mismatched_sizes=True)
            
        def get_cats(self):
            return self.id2label

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
            return DataLoader(self.train_dataset, collate_fn=collate_fn, batch_size=4, shuffle=True)

        def val_dataloader(self):
            return DataLoader(self.val_dataset, collate_fn=collate_fn, batch_size=2, shuffle=True)