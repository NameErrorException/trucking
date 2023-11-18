from flask import Flask, Response

from safety.camera import Camera

app = Flask(__name__)
camera = Camera()

# NOTE:
# https://www.digitalocean.com/community/tutorials/how-to-create-your-first-web-application-using-flask-and-python-3

@app.route('/')
def hello():
    return {"test": True}

@app.route('/camera')
def get_camera():
    return Response(camera.get_frame(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == "__main__":
    app.run(port=5000, debug=True)