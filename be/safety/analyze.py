from ultralytics import YOLO
from collections import defaultdict 
import torch, cv2, math
import numpy as np

class Analyze:
    # Load a COCO-pretrained YOLOv8n model

    model = YOLO('be/safety/model/yolov8n.pt')
    track_history = defaultdict(lambda: [])
    frame_speed = []

    num_good = 0
    num_frames = 0

    def highlight_edge(self, frame):
        # reference https://docs.opencv.org/4.x/da/d5c/tutorial_canny_detector.html

        min_white = np.array([150, 200, 200])
        max_white = np.array([255, 255, 255])

        highlighted_frame = cv2.inRange(frame, min_white, max_white)

        highlighted_frame = cv2.Canny(highlighted_frame, 50, 50*3)          # high = low * 3
        
        return highlighted_frame

    def transform_perspective(self, frame):
        # src = np.float32([[0, 720], [500, 500], [780, 500], [1280, 720]])
        src = np.float32([[0, 720], [500, 400], [780, 400], [1280, 720]])
        dst = np.float32([[0, 720], [0, 0], [1280, 0], [1280, 720]])

        transform_matrix = cv2.getPerspectiveTransform(src, dst)
        perspective_frame = cv2.warpPerspective(frame, transform_matrix, (1280, 720))

        return perspective_frame

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
        # 100 margin for x
        triangle = np.array([[100, 720], [1180, 720], [640, 500]])

        mask = cv2.fillPoly(np.zeros_like(highlighted_frame), [triangle], 255)
        masked_frame = cv2.bitwise_and(highlighted_frame, highlighted_frame, mask=mask)

        # draw lines
        lines = cv2.HoughLinesP(masked_frame, rho, theta, threshold, np.array([]), min_line_length, max_line_gap)

        # bug when lines is None
        try:
            for line in lines:
                for x1, y1, x2, y2 in line:
                    # print(f"({x1}, {y1}) -> ({x2}, {y2})")
                    # if self.valid_line(x1, y1, x2, y2):
                    cv2.line(line_image, (x1,y1), (x2,y2), (177, 40, 200), 5)

            return cv2.addWeighted(frame, 0.8, line_image, 1, 0)
        except:
            return frame

    def draw_text(self, frame, x, y, size, text):
        # object details
        x = int(x)
        y = int(y)

        org = [x, y]
        font = cv2.FONT_HERSHEY_SIMPLEX
        fontScale = size
        color = (255, 255, 255)
        thickness = 2

        cv2.putText(frame, text, org, font, fontScale, color, thickness)

    def within_triangle(self, x, y, w, h):
        x = int(x)
        y = int(y)

        if (x < 640):
            y_bound = -0.344*(x + w) + 720
        else:
            y_bound = 0.344*x + 279.68

        return y > (y_bound - 100)

    def get_3d_speed(self, frame, x1, y1, x2, y2, boxx, boxy):
        # 2 is latest, 1 is old
        speed_2d = math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
        relative_speed = ""
        
        if (speed_2d > 10 and y2 > 400):
            if (y1 - y2) < 0:
                # slower
                relative_speed = "decelerating"
            else:
                # faster
                relative_speed = 'accelerating'
        else:
            relative_speed = 'matching'
        self.frame_speed += [relative_speed]
        self.draw_text(frame, boxx, boxy, 0.5, relative_speed)

    def get_speed(self, frame, results):
        try:
            # try as var data may not exist yet
            boxes = results[0].boxes.xywh.cpu()
            track_ids = results[0].boxes.id.int().cpu().tolist()

            for box, track_id in zip(boxes, track_ids):    # convert to [[box, id], ..]

                x, y, w, h = box
                track = self.track_history[track_id]
                track.append((float(x), float(y)))

                if (self.within_triangle(x, y, w, h)):
                    # print(track)
                    if len(track) >= 2:
                        x1 = track[0][0]
                        y1 = track[0][1]
                        x2 = track[-1][0]
                        y2 = track[-1][1]
                        self.get_3d_speed(frame, x1, y1, x2, y2, x, y)
                    else:
                        pass
                        # set speed to 0
                    if len(track) > 30:  # retain 90 tracks for 90 frames
                        track.pop(0)

                    points = np.hstack(track).astype(np.int32).reshape((-1, 1, 2))
                    cv2.polylines(frame, [points], isClosed=False, color=(255, 255, 255), thickness=10)
        except Exception as e:
            pass

        return frame

    def get_speed_status(self):
        num_acc = self.frame_speed.count('accelerating')
        num_dec = self.frame_speed.count('decelerating')
        num_match = self.frame_speed.count('matching')

        speed_status = ""
        if ((num_match / len(self.frame_speed)) >= 0.5):
            speed_status = 'good'
            self.num_good += 1
        elif ((num_dec / len(self.frame_speed)) > 0.5):
            speed_status = 'too fast'
        elif ((num_acc / len(self.frame_speed)) > 0.5):
            speed_status = 'too slow'
        else:
            speed_status = 'unknown'

        return speed_status

    def new_camera(self):
        self.num_good = self.num_frames = 0

    def frame(self, frame):
        self.num_frames += 1
        # edge detect
        try:
            self.frame_speed = []

            highlighted_frame = self.highlight_edge(frame)
            anotated_frame = self.get_line(frame, highlighted_frame)

            # track car
            results = self.model.track(anotated_frame, persist=True, verbose=False)
            anotated_frame = results[0].plot()

            anotated_frame = self.get_speed(anotated_frame, results)

            speed_status = self.get_speed_status()
            safety_score = round((self.num_good / self.num_frames) * 100, 2)

            self.draw_text(anotated_frame, 0, 25, 1, f"speed status: {speed_status}")
            self.draw_text(anotated_frame, 0, 60, 1, f"safety score: {safety_score}%")

            return anotated_frame
        except Exception as e:
            return frame
        # return self.transform_perspective(frame)
        # return self.highlight_edge(frame)

