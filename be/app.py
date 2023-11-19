from flask import Flask, Response, jsonify

from safety.camera import Camera
from jobs.matching import get_current_batch, get_matching_pairs, start_client
import threading

app = Flask(__name__)
camera = Camera()
#matching = Matching()

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
    return jsonify(get_current_batch())

@app.route('/filtered')
def get_job_data():
    return jsonify(get_matching_pairs())


@app.after_request
def handle_options(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"

    return response

if __name__ == "__main__":
    threading.Thread(target=start_client).start()
    
    app.run(port=5000, debug=True)