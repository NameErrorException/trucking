from ultralytics import YOLO
import torch, cv2
import numpy as np

class Analyze:
    # Load a COCO-pretrained YOLOv8n model

    model = YOLO('be/safety/model/yolov8n.pt')

    def highlight_edge(self, frame):
        # reference https://docs.opencv.org/4.x/da/d5c/tutorial_canny_detector.html
        highlighted_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)          # grayscale
        highlighted_frame = cv2.GaussianBlur(highlighted_frame, (5, 5), 0)
        highlighted_frame = cv2.Canny(highlighted_frame, 50, 50*3)  # high = low * 3
        
        return highlighted_frame

    def get_line(self, frame, highlighted_frame):
        # https://www.geeksforgeeks.org/draw-a-filled-polygon-using-the-opencv-function-fillpoly/
        # typical constants
        rho = 1                     # distance resolution in pixels of the Hough grid
        theta = np.pi / 180         # angular resolution in radians of the Hough grid
        threshold = 0              # minimum number of votes (intersections in Hough grid cell)
        min_line_length = 0        # minimum number of pixels making up a line
        max_line_gap = 300            # maximum gap in pixels between connectable line segments
        line_image = np.copy(frame) * 0  # creating a blank to draw lines on

        # crop and get region
        triangle = np.array([[100, 720], [1180, 720], [640, 500]])

        mask = cv2.fillPoly(np.zeros_like(highlighted_frame), [triangle], 255)
        masked_frame = cv2.bitwise_and(highlighted_frame, highlighted_frame, mask=mask)

        # draw lines
        lines = cv2.HoughLinesP(masked_frame, rho, theta, threshold, np.array([]), min_line_length, max_line_gap)

        # bug when lines is None
        try:
            for line in lines:
                for x1,y1,x2,y2 in line:
                    cv2.line(line_image, (x1,y1), (x2,y2), (255,0,0), 25)

            return cv2.addWeighted(frame, 0.8, line_image, 1, 0)
        except:
            return frame

    def frame(self, frame):
        # edge detect
        highlighted_frame = self.highlight_edge(frame)
        anotated_frame = self.get_line(frame, highlighted_frame)

        # track car
        results = self.model.track(anotated_frame, persist=True, verbose=False)
        anotated_frame = results[0].plot()

        return anotated_frame

