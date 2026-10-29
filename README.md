# 🍇 HaritGrapes — AI-Powered Vineyard Monitoring & Yield Estimation

**HaritGrapes** is a full-stack agricultural technology application designed to help grape growers monitor vineyard conditions, detect grape clusters in images, estimate crop yield, and access disease and fertilizer recommendations.

Built with React, TypeScript, Python, computer vision, and machine learning, the platform combines a web-based interface with trained ML models to explore how AI can support vineyard management.

The project focuses on grape cultivation in Maharashtra, India, with the yield prediction model based on data associated with the Niphad region of Nashik.

> **Project status:** Active development / demonstration stage. The standalone Flask backend performs inference using the available trained models. Some Firebase Cloud Functions still use simulated responses. Model accuracy and agricultural recommendations require further validation before production use.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🍇 **Grape Cluster Counting** | Upload a vineyard image and use a YOLO-style object-detection model exported to ONNX to estimate the number of visible grape clusters. |
| 📈 **Yield Prediction** | Estimate vineyard yield using weather conditions and crop parameters through a trained XGBoost regression model. |
| 🩺 **Disease Detection** | Access a disease-detection workflow designed to identify conditions such as Downy Mildew, Powdery Mildew, Bacterial Rot, and Anthracnose. |
| 🌱 **Fertilizer Recommendations** | Obtain fertilizer-related guidance based on disease classification or plant health status. |
| 📊 **Dashboard** | View available vineyard statistics, prediction summaries, and scan history. |
| 📄 **PDF Reports** | Generate downloadable reports using JavaScript PDF-generation libraries. |
| 🔐 **Authentication** | Integrate Firebase Authentication with user-specific profile and application data. |
| 📷 **Camera Scanner** | Capture images directly through a compatible browser camera for vineyard analysis. |
| 🌿 **Agricultural Focus** | Explore ML-assisted vineyard monitoring and yield estimation for grape cultivation. |

**Note:** Feature availability depends on which backend implementation the frontend uses. Some features currently use demonstration responses rather than production-grade inference.

---

## 🏗️ System Architecture

HaritGrapes consists of a React frontend, a Python Flask inference service, and Firebase services, including Cloud Functions.

```text
HaritGrapes/
│
├── frontend/
│   └── src/
│       ├── pages/              # Application pages
│       ├── components/         # Reusable UI components
│       ├── firebase/           # Firebase configuration and helpers
│       └── routes/             # Application routing
│
├── backend/
│   ├── app.py                  # Flask inference API
│   ├── requirements.txt        # Python dependencies
│   ├── firestore.rules         # Firestore security rules
│   ├── firestore.indexes.json  # Firestore indexes
│   ├── storage.rules           # Firebase Storage rules
│   │
│   └── functions/
│       └── src/
│           ├── auth/           # User profile functions
│           ├── cluster/        # ONNX cluster detection
│           ├── disease/        # Disease-detection function
│           ├── yield/          # Yield prediction function
│           └── fertilizer/     # Fertilizer recommendation function
│
├── firebase.json
├── package.json
└── README.md
```

### Backend implementations

#### 1. Flask inference service

The Flask service provides endpoints for model inference using the available trained artifacts.

| Endpoint | Purpose | Implementation |
|---|---|---|
| `GET /health` | Check backend availability | Health-check endpoint |
| `POST /predict-cluster` | Count visible grape clusters | ONNX object-detection model |
| `POST /predict-yield` | Estimate crop yield | XGBoost regression model |
| `POST /recommend-fertilizer` | Generate fertilizer guidance | Decision-tree model and recommendation logic |

**Cluster detection**

The service processes uploaded images, prepares them for model inference, runs the ONNX model, and applies bounding-box filtering and non-maximum suppression to determine the final detection count.

The implementation uses the original cluster model:

`grape_cluster_final.onnx`

**Yield estimation**

The yield endpoint uses the trained XGBoost model:

`niphad_yield_2025_model_WEB.json`

The model accepts seven features:

- Temperature in °C
- Relative humidity in %
- Rainfall in mm
- Wind speed in m/s
- UV index
- Cluster count per acre
- Average cluster weight in grams

The model returns a yield estimate in the unit expected by the application. The target definition and prediction accuracy should be verified against the original training artifacts and recorded harvest data.

**Fertilizer recommendations**

The Flask implementation uses the available joblib decision-tree artifact and recommendation logic to generate fertilizer-related guidance.

The reliability of these recommendations depends on the training data, decision logic, and agricultural validation.

#### 2. Firebase Cloud Functions

Firebase Cloud Functions provide a serverless backend for supported application workflows.

| Function | Current implementation |
|---|---|
| Cluster prediction | ONNX inference implementation |
| Disease prediction | Simulated/demo response |
| Yield prediction | Simulated/demo response |
| Fertilizer recommendation | Mock recommendation lookup |
| User profile creation | Firebase-backed operation |
| User profile updates | Firebase-backed operation |

The Firebase implementation is separate from the Flask service. Consequently, the availability of a trained model in Flask does not automatically mean that the corresponding deployed Cloud Function uses that model.

The disease, yield, and fertilizer Cloud Functions require further integration before they can be treated as production ML inference endpoints.

---

## 🧰 Technology Stack

### Frontend

- **React 18** — UI development
- **TypeScript** — Type-safe application code
- **Vite** — Development server and build tooling
- **Tailwind CSS** — Styling
- **React Router** — Client-side routing
- **Recharts** — Data visualization
- **Framer Motion** — UI animations
- **Firebase SDK** — Authentication and Firebase integration
- **jsPDF** and **jspdf-autotable** — PDF report generation
- **React Hot Toast** — Notifications

### Machine Learning & Backend

- **Python**
- **Flask**
- **NumPy**
- **Pillow**
- **ONNX Runtime**
- **XGBoost**
- **scikit-learn**
- **joblib**
- **OpenCV**, where used by the relevant inference implementation

### Cloud Infrastructure

- Firebase Authentication
- Cloud Firestore
- Firebase Storage
- Firebase Cloud Functions
- Firebase Hosting

---

## 🚀 Getting Started

### Prerequisites

Install the following tools before setting up the project:

- Node.js and npm
- Python 3.9 or a compatible version supported by the project dependencies
- Git
- A Firebase project, if using Firebase-backed functionality
- Firebase CLI, if deploying Firebase resources

### 1. Clone the repository

```bash
git clone https://github.com/Anmolpandey23/HaritGrapes.git

cd HaritGrapes
```

### 2. Install frontend dependencies

```bash
cd frontend

npm install
```

### 3. Configure Firebase

If you want to use Firebase-backed functionality, configure your Firebase web application credentials in the appropriate frontend configuration.

Verify that the required Firebase services are enabled:

- Authentication
- Cloud Firestore
- Storage

Keep private credentials and service-account keys out of version control.

### 4. Configure the Python backend

Open a new terminal and navigate to the backend:

```bash
cd HaritGrapes/backend
```

Create and activate a virtual environment.

**macOS/Linux:**

```bash
python3 -m venv .venv

source .venv/bin/activate
```

Install the Python dependencies:

```bash
pip install -r requirements.txt
```

Ensure the required model files exist at the paths expected by `backend/app.py`:

```text
backend/functions/src/cluster/models/grape_cluster_final.onnx

backend/functions/src/yield/model/niphad_yield_2025_model_WEB.json

backend/functions/src/fertilizer/model/recommendation_tree.joblib
```

The filenames and paths above must match the actual files in your local repository.

### 5. Start the Flask backend

From the `backend` directory:

```bash
python app.py
```

The service is configured to listen on port `7000` by default, subject to the application's configuration.

Check the health endpoint:

```bash
curl http://localhost:7000/health
```

### 6. Start the frontend

Open another terminal:

```bash
cd HaritGrapes/frontend

npm run dev
```

If the frontend supports a configurable API URL, create the appropriate environment file and set:

```env
VITE_API_URL=http://localhost:7000
```

Restart the Vite development server after changing environment variables.

**Important:** Confirm which backend each frontend feature actually calls. A frontend connected to Firebase Cloud Functions may receive simulated predictions even when the local Flask backend contains a trained model.

---

## 📊 Machine Learning Models

### Cluster detection

The cluster-counting workflow uses an object-detection model exported to ONNX format.

The inference pipeline includes:

1. Image upload or capture.
2. Image preprocessing.
3. ONNX model inference.
4. Bounding-box decoding.
5. Confidence filtering.
6. Non-maximum suppression.
7. Returning the final detection count.

The output represents the number of detections retained by the model. It should not automatically be interpreted as a perfectly accurate count of every individual grape bunch, particularly when bunches overlap or touch.

### Yield prediction

The yield-estimation workflow uses an XGBoost regression model with weather and vineyard parameters.

The model produces an estimate based on patterns learned during training. Its reliability depends on the quality of the training data, the consistency of feature definitions and units, and how closely the prediction inputs match the data on which the model was trained.

Predictions should be evaluated against actual harvest measurements before being used for agricultural decisions.

### Disease detection and fertilizer recommendations

The application includes disease-detection and fertilizer-recommendation workflows.

However, the current Firebase Cloud Functions for these features use demonstration implementations. Their presence in the interface should not be interpreted as proof of production-grade disease classification or validated fertilizer prescriptions.

---

## 🔐 Data & Security

HaritGrapes uses Firebase services to support authentication and user-specific data.

The intended Firestore data structure includes:

```text
users/{uid}/
├── profile/info
├── scans/{scanId}
├── yield/{yieldId}
└── fertilizer/{fertilizerId}

support_contacts/{contactId}
```

The repository includes Firestore and Storage security rules.

Before deployment, review the rules against the actual application workflows and verify that users cannot access another user's private records. Public support-form submissions should be validated and protected against abuse.

Do not commit Firebase service-account credentials, API secrets, or other sensitive configuration values.

---

## 🧪 Testing & Validation

Before using the application beyond demonstration purposes, validate both the software and the machine-learning outputs.

Recommended checks include:

- Frontend production build
- Backend endpoint tests
- Model-loading and inference tests
- Invalid-input and missing-file validation
- Cluster-count evaluation against manually annotated images
- Yield prediction comparison against actual harvest records
- Verification that each frontend feature calls the intended backend
- Firebase Authentication and Firestore authorization tests

Successful execution of a model does not establish its prediction accuracy. Quantitative evaluation requires a suitable labelled test dataset.

---

## 🗺️ Roadmap

- [ ] Improve cluster detection for touching and overlapping grape bunches.
- [ ] Evaluate cluster-count accuracy on a larger annotated image dataset.
- [ ] Validate yield predictions against actual vineyard harvest data.
- [ ] Integrate production ML inference into the disease-detection Cloud Function.
- [ ] Replace simulated yield responses in Firebase Cloud Functions with the trained model.
- [ ] Integrate the fertilizer model into the corresponding production workflow.
- [ ] Consolidate the Flask service and Firebase Cloud Functions architecture.
- [ ] Expand automated tests for frontend components and backend endpoints.
- [ ] Improve monitoring, error handling, and input validation.
- [ ] Evaluate deployment options for low-connectivity vineyard environments.

---

## 🤝 Contributing

Contributions, bug reports, and suggestions are welcome.

1. Fork the repository.
2. Create a feature branch:

   ```bash
   git checkout -b feature/your-feature
   ```

3. Implement and test your changes.
4. Commit your work:

   ```bash
   git commit -m "Describe your changes"
   ```

5. Push the branch:

   ```bash
   git push origin feature/your-feature
   ```

6. Open a Pull Request describing the changes and tests performed.

---

## 📄 License

This project is released under the MIT License. See the [`LICENSE`](LICENSE) file for the applicable terms.

Copyright © 2025 Anmol Dinesh Pandey.

---

## 👤 Author

**Anmol Dinesh Pandey**

GitHub: [@Anmolpandey23](https://github.com/Anmolpandey23)

Repository: [HaritGrapes](https://github.com/Anmolpandey23/HaritGrapes)

---

*HaritGrapes explores the application of computer vision and machine learning to grape cultivation, with the goal of making vineyard monitoring and yield estimation more accessible to growers.*
