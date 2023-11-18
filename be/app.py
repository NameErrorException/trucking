from flask import Flask, Response, jsonify

from safety.camera import Camera
from jobs.data import Data

app = Flask(__name__)
camera = Camera()
data = Data()

# NOTE:
# https://www.digitalocean.com/community/tutorials/how-to-create-your-first-web-application-using-flask-and-python-3

@app.route('/')
def hello():
    return {"test": True}

@app.route('/camera')
def get_camera():
    return Response(camera.get_frame(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/data')
def get_current_data():
    return jsonify(data.get_current_data())

@app.route('/filtered')
def get_job_data():
    # the notification job list
    return jsonify(data.get_filtered())

if __name__ == "__main__":
    app.run(port=5000, debug=True)