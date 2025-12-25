import onnxruntime as ort
import numpy as np
from PIL import Image

MODEL_PATH = 'models/grape_cluster_final.onnx'

ort_session = ort.InferenceSession(MODEL_PATH)

def predict_clusters(image_path, conf_threshold=0.5, size=640):
    # Preprocess image
    img = Image.open(image_path).resize((size, size)).convert('RGB')
    arr = np.array(img, dtype=np.float32)
    arr = np.transpose(arr, (2, 0, 1))  # [C, H, W]
    arr /= 255.0
    arr = np.expand_dims(arr, axis=0)   # [1, C, H, W]

    input_name = ort_session.get_inputs()[0].name
    outputs = ort_session.run(None, {input_name: arr})

    # For YOLO/SSD: output[0] shape is [1, N, 6]: [x1, y1, x2, y2, score, class or cluster]
    boxes = outputs[0][0]        # shape: (N, 6)
    confs = boxes[:, 5]          # Typically the confidence column

    # Filter boxes by confidence
    detected = boxes[confs > conf_threshold]
    cluster_count = len(detected)

    print(f"Image: {image_path}")
    print(f"  Prediction: cluster_count={cluster_count}")
    print(f"  Conf min={confs.min()}, max={confs.max()}")
    print(f"  Top 5 boxes: {detected[:5]}")
    # Optionally, return boxes for further use
    return cluster_count, detected

# Example usage:
if __name__ == '__main__':
    import sys
    # Usage: python runclusteronnx.py image1.jpg image2.jpg ...
    for image_path in sys.argv[1:]:
        predict_clusters(image_path, conf_threshold=0.5)
