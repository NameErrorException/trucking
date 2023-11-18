from ultralytics import YOLO
import torch

class Analyze:
    # Load a COCO-pretrained YOLOv8n model

    torch.cuda.set_device(0)
    model = YOLO('be/safety/model/yolov8n.pt')

    def frame(self, frame):
        # track car
        results = self.model.track(frame, persist=True, verbose=False)
        anotated_frame = results[0].plot()

        return anotated_frame

