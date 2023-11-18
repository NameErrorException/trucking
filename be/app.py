from flask import Flask

app = Flask(__name__)

# NOTE:
# https://www.digitalocean.com/community/tutorials/how-to-create-your-first-web-application-using-flask-and-python-3

@app.route('/')
def hello():
    return {"test": True}

if __name__ == "__main__":
    app.run(port=5000, debug=True)