from flask import Flask, render_template, request, jsonify
import cv2
import numpy as np
import base64
from ultralytics import YOLO
from io import BytesIO
from PIL import Image

app = Flask(__name__)
model = YOLO('yolov8n.pt')  # or 'yolov5s.pt'

def readb64(uri):
    encoded_data = uri.split(',')[1]
    nparr = np.frombuffer(base64.b64decode(encoded_data), np.uint8)
    return cv2.imdecode(nparr, cv2.IMREAD_COLOR)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/process_frame', methods=['POST'])
def process_frame():
    data = request.json['image']
    frame = readb64(data)
    results = model(frame, imgsz=320, conf=0.4)
    detections = results[0].boxes.data.tolist()

    # Optional: filter detections or cheating conditions
    response = {'status': 'ok', 'detections': len(detections)}
    return jsonify(response)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10000)
