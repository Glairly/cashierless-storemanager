import torch
from PIL import Image

class SnacksDetection:
    # colors for visualization
    COLORS = [[0.000, 0.447, 0.741], [0.850, 0.325, 0.098], [0.929, 0.694, 0.125],
            [0.494, 0.184, 0.556], [0.466, 0.674, 0.188], [0.301, 0.745, 0.933]]

    def __init__(self, model, feature_extractor, labels):
        self.model = model
        self.feature_extractor = feature_extractor
        self.labels = labels

    # for output bounding box post-processing
    def box_cxcywh_to_xyxy(self,x):
        x_c, y_c, w, h = x.unbind(1)
        b = [(x_c - 0.5 * w), (y_c - 0.5 * h),
            (x_c + 0.5 * w), (y_c + 0.5 * h)]
        return torch.stack(b, dim=1)

    def rescale_bboxes(self,out_bbox, size):
        img_w, img_h = size
        b = self.box_cxcywh_to_xyxy(out_bbox)
        b = b * torch.tensor([img_w, img_h, img_w, img_h], dtype=torch.float32)
        return b

    def result_to_bbox(self, image, outputs, threshold=0.9, keep_highest_scoring_bbox=False):
        # keep only predictions with confidence >= threshold
        probas = outputs.logits.softmax(-1)[0, :, :-1]
        keep = probas.max(-1).values > threshold
        if keep_highest_scoring_bbox:
            keep = probas.max(-1).values.argmax()
            keep = torch.tensor([keep])
        
        # convert predicted boxes from [0; 1] to image scales
        bboxes_scaled = self.rescale_bboxes(outputs.pred_boxes[0, keep].cpu(), image.size)
        
        labels = []
        bboxs = []

        for p, (xmin, ymin, xmax, ymax) in zip(probas[keep], bboxes_scaled.tolist()):
            cl = torch.argmax(p)

            try:
                self.labels[cl.item()]
                text = f"{self.labels[cl.item()]}"
            except Exception as e:
                print(e)
                print(p,cl)
                exit()

            labels.append(text)
            bboxs += [[int(xmin), int(ymin), int(xmax), int(ymax)]]

        return labels, bboxs

    def predict(self, image: Image.Image):
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

        encoding = self.feature_extractor(images=image, return_tensors="pt")
        pixel_values = encoding["pixel_values"].squeeze() # remove batch dimension
        pixel_values = pixel_values.unsqueeze(0).to(device)
        outputs = self.model(pixel_values=pixel_values, pixel_mask=None)

        return self.result_to_bbox(image, outputs, threshold=0.8, keep_highest_scoring_bbox=False)