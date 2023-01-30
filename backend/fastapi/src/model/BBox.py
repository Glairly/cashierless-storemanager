class BBox:
    label: str
    x1: float
    y1: float
    x2: float
    y2: float

    def __init__(self) -> None:
        pass

    def __init__(self,label, bbox) -> None:
        self.label = label
        self.x1 = bbox[0]
        self.y1 = bbox[1]
        self.x2 = bbox[2]
        self.y2 = bbox[3]

    @staticmethod
    def toBBoxList(labels: list,bboxes: list) -> list:
        result = []
        for i in range(len(labels)):
            result.append(BBox(labels[i],bbox=bboxes[i]))
        return result