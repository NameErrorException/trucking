import cv2

from safety.analyze import Analyze

class Camera:
    """
    NOTE: camera will be a video for the purpose of the demo, however all processing is done in real time.
    """
    path = "be/safety/data/"
    video_file = "driving4.mp4"

    # initialize model
    analyze = Analyze()

    def get_video(self):  
        return self.path + self.video_file

    def get_frame(self):
        # reset video frames
        self.analyze.new_camera()

        # get video
        video_path = self.get_video()
        video = cv2.VideoCapture(video_path)

        # set video dimensions
        video.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
        video.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

        while True:
            # get frame
            success, frame = video.read()
            if success:
                # analysis
                frame = self.analyze.frame(frame)

                ret, buffer = cv2.imencode(".jpg", frame)
                frame = buffer.tobytes()
            else:
                # loop the video
                video.set(cv2.CAP_PROP_POS_FRAMES, 0)
                continue

            yield(b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')