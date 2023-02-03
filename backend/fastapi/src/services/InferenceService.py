from ..model.DecodeResult import DecodeResult
from ..model.DetectionResult import DetectionResult
from ..model.BBox import BBox

class InferenceService:

    def __init__(self) -> None:
        self.db = {
            "4713072178244": {
                'name': 'Oishi_Yellow',
                'price': 10
            }
        }

    def detection_qr_collision_merge(self, detection_result: DetectionResult, decode_result: DecodeResult) -> list:
        detection_result = BBox.toBBoxList(detection_result.labels, detection_result.bboxes)
        decode_result = BBox.toBBoxList(decode_result.labels, decode_result.bboxes)

        for bb in decode_result:
            detection_result = sorted(detection_result, key=lambda x: self.find_collision(x, bb), reverse=True)

        return detection_result + decode_result

    def find_collision(self, aa: BBox, bb: BBox) -> float:
        try:
            iou = self.calculate_iou(aa, bb)
            assert aa.label == bb.label
            return iou
        except:
            return 0.0

    def calculate_iou(self, bb1: BBox, bb2: BBox) -> float:
        assert bb1.x1 < bb1.x2
        assert bb1.y1 < bb1.y2
        assert bb2.x1 < bb2.x2
        assert bb2.y1 < bb2.y2

        x_left = max(bb1.x1, bb2.x1)
        y_top = max(bb1.y1, bb2.y1)
        x_right = min(bb1.x2, bb2.x2)
        y_bottom = min(bb1.y2, bb2.y2)

        if x_right < x_left or y_bottom < y_top:
            return 0.0

        intersection_area = (x_right - x_left) * (y_bottom - y_top)
        bb1_area = (bb1.x2 - bb1.x1) * (bb1.y2 - bb1.y1)
        bb2_area = (bb2.x2 - bb2.x1) * (bb2.y2 - bb2.y1)

        iou = intersection_area / (bb1_area + bb2_area - intersection_area)
        assert 0.0 <= iou <= 1.0

        return iou
