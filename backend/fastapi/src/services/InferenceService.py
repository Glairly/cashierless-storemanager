from ..model.DecodeResult import DecodeResult
from ..model.DetectionResult import DetectionResult
from ..model.BBox import BBox

class InferenceService:

    def __init__(self) -> None:
        self.db = { 
            # barcode num
            "4713072178244" : { 
                'name' : 'Oishi_Yellow',
                'price' : 10
            }
        }

    def detection_qr_collision_merge(self, detectionResult: DetectionResult, decodeResult: DecodeResult) -> None:
        
        _detectionResult = BBox.toBBoxList(detectionResult.labels, detectionResult.bboxes)
        _decodeResult = BBox.toBBoxList(decodeResult.labels, decodeResult.bboxes)
        
        for bb in _decodeResult:
            _detectionResult = sorted(_detectionResult, key= lambda x: self.find_collision(x, bb), reverse=True)
            
            # if (self.find_collision( _detectionResult[0], bb)):
            #     _detectionResult = _detectionResult[1:]

        return list(_detectionResult) +  _decodeResult
        
    def find_collision(self, aa: BBox, bb: BBox):
            try:
                iou = self.calculate_iou(aa, bb)
                assert aa.label == bb.label
                return iou
            except:
                return 0

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

        # compute the area of both AABBs
        bb1_area = (bb1.x2 - bb1.x1) * (bb1.y2 - bb1.y1)
        bb2_area = (bb2.x2 - bb2.x1) * (bb2.y2 - bb2.y1)

        iou = intersection_area / float(bb1_area + bb2_area - intersection_area)
        assert iou >= 0.0
        assert iou <= 1.0

        return iou