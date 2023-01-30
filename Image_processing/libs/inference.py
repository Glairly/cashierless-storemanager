import torch
import matplotlib.pyplot as plt
from PIL import Image
from time import time
import numpy as np

import cv2

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

    def plot_results(self, pil_img, prob, boxes):
        plt.figure(figsize=(16,10))
        plt.imshow(pil_img)
        ax = plt.gca()
        colors = self.COLORS * 100
        for p, (xmin, ymin, xmax, ymax), c in zip(prob, boxes.tolist(), colors):
            ax.add_patch(plt.Rectangle((xmin, ymin), xmax - xmin, ymax - ymin,
                                    fill=False, color=c, linewidth=10))
            cl = p.argmax()
            text = f"{self.labels[cl.item()]}: {p[cl]:0.2f}"
            ax.text(xmin, ymin, text, fontsize=15,
                    bbox=dict(boxstyle='round', ec=(1., 0.5, 0.5),fc=(1., 0.8, 0.8)))

        plt.axis('off')
        # plt.show()

    def visualize_predictions(self,image, outputs, threshold=0.9, keep_highest_scoring_bbox=False):
        # keep only predictions with confidence >= threshold
        probas = outputs.logits.softmax(-1)[0, :, :-1]
        keep = probas.max(-1).values > threshold
        if keep_highest_scoring_bbox:
            keep = probas.max(-1).values.argmax()
            keep = torch.tensor([keep])
        
        # convert predicted boxes from [0; 1] to image scales
        bboxes_scaled = self.rescale_bboxes(outputs.pred_boxes[0, keep].cpu(), image.size)
        # plot results
        # self.plot_results(image, probas[keep], bboxes_scaled)

        return bboxes_scaled.tolist(),  


    def predict(self, image: Image.Image):
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

        encoding = self.feature_extractor(images=image, return_tensors="pt")
        pixel_values = encoding["pixel_values"].squeeze() # remove batch dimension
        pixel_values = pixel_values.unsqueeze(0).to(device)
        outputs = self.model(pixel_values=pixel_values, pixel_mask=None)

        return self.result_to_bbox(image, outputs, threshold=0.8, keep_highest_scoring_bbox=False)
        # return self.visualize_predictions(image, outputs, threshold=0.8, keep_highest_scoring_bbox=False)

    def predict_stream(self,image):
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

        encoding = self.feature_extractor(images=image, return_tensors="pt")
        pixel_values = encoding["pixel_values"].squeeze() # remove batch dimension
        pixel_values = pixel_values.unsqueeze(0).to(device)
        outputs = self.model(pixel_values=pixel_values, pixel_mask=None)
        
        return outputs

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
                text = f"{self.labels[cl.item()]}: {p[cl]:0.2f}"
            except Exception as e:
                print(e)
                print(p,cl)
                exit()

            labels.append(text)
            bboxs += [[int(xmin), int(ymin), int(xmax), int(ymax)]]

        return labels, bboxs
            

    def plot_boxes(self, results, frame):
        labels, cord = results
        n = len(labels)
        # x_shape, y_shape = frame.shape[1], frame.shape[0]
        for i in range(n):
            row = cord[i]
            x1, y1, x2, y2 = row
            bgr = (0, 0, 255)
            cv2.rectangle(frame, (x1, y1), (x2, y2), bgr, 5)
            label = labels[i]

            # Label bg
            textSize = cv2.getTextSize(label,  cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2);
            cv2.rectangle(frame, (x1, y1 - textSize[0][1] ), (x1 + textSize[0][0], y1 + textSize[0][1]), bgr, -1)
            # label
            cv2.putText(frame, label, (x1, y1), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
            # total snaccks
            cv2.putText(frame, f"Total Snacks: {n}", (15, 15), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

        return frame

    def streams(self):
        # Open Camera
        player = cv2.VideoCapture(1)
        assert player is not None
        assert player.isOpened()

        fc = 0
        fps = 0

        while True:
            fc += 1
            start_time = time()
            ret, frame = player.read()
            if not ret:
                break
            
            frame = cv2.resize(frame, (1280, 960)) 

            # Convert CV2 to PIL
            _frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            _frame = Image.fromarray(_frame)
            # Prediction goes here
            outputs =  self.predict_stream(image=_frame)
            bbox = self.result_to_bbox(_frame, outputs, threshold=0.7, keep_highest_scoring_bbox=False)
            frame = self.plot_boxes(bbox, frame)
            ########################

            cv2.imshow('frame', frame)
            end_time = time()
            fps += 1/np.round(end_time - start_time, 3)
            if fc == 10:
                fps = (fps / 10)
                print(f"Frames Per Second : {fps}")
            
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
            # out.write(frame)
        player.release()
        cv2.destroyAllWindows()
