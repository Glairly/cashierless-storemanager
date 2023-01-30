import torch
from . import CocoDetection
import pytorch_lightning as pl
from transformers import DetrForObjectDetection, DetrFeatureExtractor
from torch.utils.data import DataLoader


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

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

class Detr(pl.LightningModule):
        
        def __init__(self, config, dataset_path=None):
            super().__init__()

            if(dataset_path == None):
                raise Exception("Dataset path is not defined.")
            # see https://github.com/PyTorchLightning/pytorch-lightning/pull/1896
            self.lr = config["lr"]
            self.lr_backbone = config["lr_backbone"]
            self.weight_decay = config["weight_decay"]
            self.epochs = config["epochs"]
            self.batch_size = config["batch_size"]
            self.dataset_path = dataset_path

            self.feature_extractor = DetrFeatureExtractor.from_pretrained("facebook/detr-resnet-50")
            self.train_dataset = CocoDetection(img_folder=f'{dataset_path}/train', feature_extractor=self.feature_extractor)
            self.val_dataset = CocoDetection(img_folder=f'{dataset_path}/valid', feature_extractor=self.feature_extractor)

            cats = self.train_dataset.coco.cats
            self.id2label = {k: v['name'] for k,v in cats.items()}

            print("Number of training examples:", len(self.train_dataset))
            self.model = DetrForObjectDetection.from_pretrained("facebook/detr-resnet-50", 
                                                                num_labels=len(self.id2label),
                                                                ignore_mismatched_sizes=True)
             
        def id2label(self):
            return self.id2label
        
        def train_dataset(self):
            return self.trian_dataset

        def val_dataset(self):
            return self.val_dataset
        
        def get_cats(self):
            return self.id2label

        def forward(self, pixel_values, pixel_mask):
            outputs = self.model(pixel_values=pixel_values, pixel_mask=pixel_mask)

            return outputs

        def box_cxcywh_to_xyxy(self,x):
            x_c, y_c, w, h = x.unbind(1)
            b = [(x_c - 0.5 * w), (y_c - 0.5 * h),
                (x_c + 0.5 * w), (y_c + 0.5 * h)]
            return torch.stack(b, dim=1).to(device)

        def rescale_bboxes(self,out_bbox, size):
            img_w, img_h = size
            b = self.box_cxcywh_to_xyxy(out_bbox) 
            b = b * torch.tensor([img_w, img_h, img_w, img_h], dtype=torch.float32).to(device)
            return b
        
        def to_evaluate_format(self, probas, bboxes):
            return dict(
                boxes =torch.tensor([bb for bb in bboxes.tolist()]).to(device),
                scores=torch.tensor([p.max() for p in probas]).to(device),
                labels=torch.tensor([p.argmax().item() for p in probas]).to(device),
            )
            
        def accuracy(self, outputs, labels):
            threshold=0.9

            acc = []
            logits = outputs['logits']
            pred_boxes = outputs['pred_boxes']

            # self.print(labels)

            for idx in range(len(labels)):
                target = labels[idx]
                # keep only predictions with confidence >= threshold

                # self.log("logit",logit, on_step=True)
                probas = logits.softmax(-1)[idx,:, :-1]
                keep = probas.max(-1).values > threshold
                size = target['size']

                # convert predicted boxes from [0; 1] to image scales
                bboxes_scaled = self.rescale_bboxes(pred_boxes[idx, keep].cpu(), size)

                preds = [self.to_evaluate_format(probas[keep], bboxes_scaled)]

                class_labels = target['class_labels']
                
                boxes = target['boxes']
                boxes = self.rescale_bboxes(boxes, size)
                
                actual = [
                    dict(
                        boxes = boxes.to(device),
                        labels= torch.tensor(class_labels).to(device),
                      )
                ]
                metric = MeanAveragePrecision()
                metric.update(preds, actual)
                
                acc += [metric.compute()["map"]]
            
             
            return torch.tensor(acc).mean()

        def common_step(self, batch, batch_idx):
            pixel_values = batch["pixel_values"]
            pixel_mask = batch["pixel_mask"]

            labels = [{k: v.to(self.device) for k, v in t.items()} for t in batch["labels"]]

            outputs = self.model(pixel_values=pixel_values, pixel_mask=pixel_mask, labels=labels)

            accuracy = self.accuracy(outputs, labels)

            loss = outputs.loss
            loss_dict = outputs.loss_dict

            return loss, loss_dict, accuracy
        

        def training_step(self, batch, batch_idx):
            loss, loss_dict, accuracy = self.common_step(batch, batch_idx)    
            # logs metrics for each training_step,
            # and the average across the epoch
            self.log("ptl/train_loss", loss)
            self.log("ptl/train_accuracy", accuracy)

            self.log("training_loss", loss)
            self.log("training_accuracy", accuracy)
            for k,v in loss_dict.items():
                self.log("train_" + k, v.item())

            return loss

        def validation_step(self, batch, batch_idx):
            loss, loss_dict, accuracy = self.common_step(batch, batch_idx)     
            self.log("validation_loss", loss)
            self.log("validation_accuracy", accuracy)

            for k,v in loss_dict.items():
                self.log("validation_" + k, v.item())

            return {"val_loss": loss, "val_accuracy": accuracy }
        
        def validation_epoch_end(self, outputs):
            avg_loss = torch.stack([x["val_loss"] for x in outputs]).mean()
            avg_acc  = torch.stack([x["val_accuracy"] for x in outputs]).mean()
            self.log("ptl/val_loss", avg_loss)
            self.log("ptl/val_accuracy", avg_acc)

        def configure_optimizers(self):
            param_dicts = [
                {
                    "params": [p for n, p in self.named_parameters() if "backbone" not in n and p.requires_grad]},
                {
                    "params": [p for n, p in self.named_parameters() if "backbone" in n and p.requires_grad],
                    "lr": self.lr_backbone,
                },
            ]
            optimizer = torch.optim.AdamW(param_dicts, lr=self.lr,
                                    weight_decay=self.weight_decay)
            
            return optimizer

        def train_dataloader(self):
            return DataLoader(self.train_dataset, collate_fn=collate_fn, batch_size=self.batch_size, shuffle=True)
 
        def val_dataloader(self):
            return DataLoader(self.val_dataset, collate_fn=collate_fn, batch_size=self.batch_size, shuffle=True)
        
        def get_epochs(self):
            return self.epochs