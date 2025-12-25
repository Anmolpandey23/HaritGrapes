from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import numpy as np
import onnxruntime as ort
import xgboost as xgb
import joblib
from PIL import Image

app = Flask(__name__)
CORS(app)

# Get the directory where app.py is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# -------- CLUSTER MODEL --------
CLUSTER_MODEL_PATH = os.path.join(BASE_DIR, "functions/src/cluster/models/grape_cluster_final.onnx")
if not os.path.exists(CLUSTER_MODEL_PATH):
    raise FileNotFoundError(f"ONNX model not found at {CLUSTER_MODEL_PATH}")
print(f"Loading ONNX cluster model from: {CLUSTER_MODEL_PATH}")
cluster_session = ort.InferenceSession(CLUSTER_MODEL_PATH)

def letterbox(im, new_shape=(640, 640), color=(114, 114, 114)):
    shape = im.size
    r = min(new_shape[0] / shape[1], new_shape[1] / shape[0])
    new_unpad = (int(round(shape[0] * r)), int(round(shape[1] * r)))
    dw, dh = new_shape[1] - new_unpad[0], new_shape[0] - new_unpad[1]
    dw /= 2
    dh /= 2
    im_resized = im.resize(new_unpad, Image.BILINEAR)
    new_im = Image.new('RGB', new_shape, color)
    new_im.paste(im_resized, (int(dw), int(dh)))
    return new_im, r, dw, dh

def xywh2xyxy(x):
    y = np.zeros_like(x)
    y[:, 0] = x[:, 0] - x[:, 2] / 2
    y[:, 1] = x[:, 1] - x[:, 3] / 2
    y[:, 2] = x[:, 0] + x[:, 2] / 2
    y[:, 3] = x[:, 1] + x[:, 3] / 2
    return y

def nms(boxes, scores, iou_threshold=0.45):
    x1 = boxes[:, 0]
    y1 = boxes[:, 1]
    x2 = boxes[:, 2]
    y2 = boxes[:, 3]
    areas = (x2 - x1) * (y2 - y1)
    order = scores.argsort()[::-1]
    keep = []
    while order.size > 0:
        i = order[0]
        keep.append(i)
        xx1 = np.maximum(x1[i], x1[order[1:]])
        yy1 = np.maximum(y1[i], y1[order[1:]])
        xx2 = np.minimum(x2[i], x2[order[1:]])
        yy2 = np.minimum(y2[i], y2[order[1:]])
        w = np.maximum(0.0, xx2 - xx1)
        h = np.maximum(0.0, yy2 - yy1)
        inter = w * h
        ovr = inter / (areas[i] + areas[order[1:]] - inter)
        inds = np.where(ovr <= iou_threshold)[0]
        order = order[inds + 1]
    return keep

def predict_clusters(file, conf_threshold=0.25, iou_threshold=0.45):
    img = Image.open(file.stream).convert('RGB')
    img_letterbox, r, dw, dh = letterbox(img, (640, 640))
    img_arr = np.array(img_letterbox, dtype=np.float32)
    img_arr = np.transpose(img_arr, (2, 0, 1))
    img_arr /= 255.0
    img_arr = np.expand_dims(img_arr, axis=0)

    input_name = cluster_session.get_inputs()[0].name
    outputs = cluster_session.run(None, {input_name: img_arr})
    pred = outputs[0][0]

    boxes = xywh2xyxy(pred[:, :4])
    boxes[:, [0, 2]] -= dw
    boxes[:, [1, 3]] -= dh
    boxes /= r
    confs = pred[:, 4] * pred[:, 5]
    mask = confs > conf_threshold
    boxes, confs = boxes[mask], confs[mask]
    if boxes.shape[0] == 0:
        return 0
    keep = nms(boxes, confs, iou_threshold=iou_threshold)
    boxes, confs = boxes[keep], confs[keep]
    return len(boxes)

@app.route('/predict-cluster', methods=['POST'])
def predict_cluster():
    if 'image' not in request.files:
        return jsonify({'error': 'No image'}), 400
    file = request.files['image']
    try:
        count = predict_clusters(file)
        return jsonify({'prediction': int(count)})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# -------- YIELD MODEL --------
YIELD_MODEL_PATH = os.path.join(BASE_DIR, "functions/src/yield/model/niphad_yield_2025_model_WEB.json")
yield_booster = xgb.Booster()
yield_booster.load_model(YIELD_MODEL_PATH)

YIELD_FEATURE_NAMES = [
    "temperature_C",
    "humidity_%",
    "rainfall_mm",
    "wind_speed_mps",
    "uv_index",
    "cluster_count_per_acre",
    "avg_cluster_weight_g"
]

@app.route('/predict-yield', methods=['POST'])
def predict_yield():
    try:
        req_json = request.get_json(force=True)
        features = req_json.get('features')
        if features is None:
            return jsonify({'error': 'Missing features list!'}), 400
        if not isinstance(features, list) or len(features) != len(YIELD_FEATURE_NAMES):
            return jsonify({'error': f'Features should be a list of length {len(YIELD_FEATURE_NAMES)}: {YIELD_FEATURE_NAMES}'}), 400
        try:
            features = [float(f) for f in features]
        except (ValueError, TypeError):
            return jsonify({'error': 'All features must be numbers.'}), 400
        dmatrix = xgb.DMatrix(np.array([features]), feature_names=YIELD_FEATURE_NAMES)
        prediction = yield_booster.predict(dmatrix)
        return jsonify({'predicted_yield': float(prediction[0])})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# -------- FERTILIZER MODEL --------
FERT_MODEL_PATH = os.path.join(BASE_DIR, "functions/src/fertilizer/model/recommendation_tree.joblib")
fert_model = joblib.load(FERT_MODEL_PATH)

disease_mapping = {
    "bacterial rot": 0,
    "downey mildew": 1,
    "powdery mildew": 2
}
HEALTHY_KEYS = {"healthy", "healthy leaves", "healthy leaf"}

fertilizer_info = {
    0: {
        "name": "Bacterial Rot Defense + NPK",
        "dosage": "Copper-based bactericide 2.5 kg/acre + 45 kg/acre NPK (19-19-19)",
        "advice": "Remove rotted stems immediately. Apply bactericide spray as symptoms emerge.",
        "application": "Avoid poor drainage and excess irrigation. Spray every 8 days, max 3 times/month."
    },
    1: {
        "name": "Downey Mildew Treatment + NPK",
        "dosage": "2.5 kg/acre copper spray + 50 kg/acre NPK (19-19-19)",
        "advice": "Apply copper-based bactericide at first signs. Remove infected parts. Spray before flowering for best results.",
        "application": "Spray every 10-12 days. Avoid overhead irrigation and waterlogging."
    },
    2: {
        "name": "Powdery Mildew Solution + NPK",
        "dosage": "Contact fungicide per label + 35 kg/acre NPK (15-15-15)",
        "advice": "Apply fungicide early in season. Ensure good air circulation.",
        "application": "Spray every 8-10 days; avoid wet foliage in late afternoons."
    },
    5: {
        "name": "Downey Mildew Advanced Treatment + NPK",
        "dosage": "3 kg/acre copper spray + 45 kg/acre NPK (20-10-10)",
        "advice": "Apply at disease onset and after heavy rains. Monitor weather and reapply as needed.",
        "application": "Spray every 10 days in wet season. Avoid late-day applications."
    },
    6: {
        "name": "Powdery Mildew Enhanced Defense + NPK",
        "dosage": "Sulfur fungicide as directed + 40 kg/acre NPK (16-16-16)",
        "advice": "Apply as soon as white powdery spots are visible. Repeat if conditions are favorable for disease.",
        "application": "Spray every 7 days during active outbreak. Avoid spraying during extreme heat."
    }
}

healthy_recommendation = {
    "name": "Grape Health Booster + NPK",
    "dosage": "10–15 kg/acre well-decomposed organic manure + 25–30 kg/acre balanced NPK (e.g. 19-19-19)",
    "advice": "Maintain regular irrigation, avoid waterlogging, and apply organic matter to improve soil health.",
    "application": "Apply near root zone, lightly incorporate into soil. Repeat before flowering and post-harvest."
}

@app.route('/recommend-fertilizer', methods=['POST'])
def recommend_fertilizer():
    try:
        req_json = request.get_json()
        if req_json is None:
            return jsonify({'error': 'Missing JSON body'}), 400
        if req_json.get("data") is not None:
            features_dict = req_json["data"]
        elif "disease" in req_json:
            features_dict = {"disease": req_json["disease"]}
        else:
            return jsonify({'error': 'Missing input data'}), 400

        raw_disease = str(features_dict.get("disease", "")).strip().lower()

        if raw_disease in HEALTHY_KEYS:
            info = healthy_recommendation
            return jsonify({
                'recommendation': info["name"],
                'fertilizer': info["name"],
                'dosage': info["dosage"],
                'advice': info["advice"],
                'application': info["application"],
                'model_output': 'healthy'
            })

        disease_value = disease_mapping.get(raw_disease)
        if disease_value is None:
            return jsonify({'error': f'Unknown disease: {features_dict.get("disease", "")}'}), 400

        features_dict["disease"] = disease_value
        input_arr = np.array([list(features_dict.values())], dtype=float)
        pred = fert_model.predict(input_arr)
        pred_class = int(pred[0])

        info = fertilizer_info.get(pred_class, {
            "name": f"Unknown fertilizer for code {pred_class}",
            "dosage": "Refer to package",
            "advice": "Apply as per package/agronomy guidelines.",
            "application": "Soil/Spray"
        })

        return jsonify({
            'recommendation': info["name"],
            'fertilizer': info["name"],
            'dosage': info["dosage"],
            'advice': info["advice"],
            'application': info["application"],
            'model_output': pred_class
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# -------- GENERIC HEALTH ENDPOINT --------
@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'}), 200

if __name__ == '__main__':
    app.run(port=7000, debug=True)
