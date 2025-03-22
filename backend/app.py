from flask import Flask, render_template, Response
from flask_cors import CORS
from check_attention import generate_frames


app = Flask(__name__)
CORS(app)

# @app.route('/')
# def index():
    # return render_template('test.html')


@app.route('/video')
def video():
    return Response(generate_frames(), mimetype='text/event-stream')

if __name__ == "__main__":
    app.run(debug=True)