import torchvision
import torch
import os
import pytorch_lightning as pl
from transformers import DetrForObjectDetection

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
