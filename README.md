# 🍇 HaritGrapes
### AI-Assisted Vineyard Monitoring, Grape Cluster Detection & Yield Estimation

**HaritGrapes** is an AI-assisted vineyard monitoring application designed to help grape growers access useful insights about their vineyards. It combines computer vision, machine learning, weather-related inputs, and a modern web interface to support grape cluster counting, yield estimation, and fertilizer recommendations.

The platform provides a multilingual interface in **English, Hindi, and Marathi**, making its features more accessible to users in grape-growing regions.

🌐 **Live Demo:** [https://haritgrapes.netlify.app/](https://haritgrapes.netlify.app/)

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Live Demo](#-live-demo)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Machine Learning Models](#-machine-learning-models)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Configuration](#-environment-configuration)
- [Running the Application](#-running-the-application)
- [Application Workflow](#-application-workflow)
- [Security Considerations](#-security-considerations)
- [Limitations and Validation](#-limitations-and-validation)
- [Future Improvements](#-future-improvements)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## 🌱 Overview

Grape cultivation requires continuous monitoring and informed decisions about crop conditions, expected production, and nutrient management. Estimating grape cluster counts and harvest yield manually can be time-consuming, while fertilizer decisions often require consideration of multiple environmental and crop-related factors.

HaritGrapes aims to simplify parts of this process through an integrated web application that combines:

- **Computer vision** for grape cluster detection and counting.
- **Machine learning** for yield estimation using environmental and vineyard-related inputs.
- **Decision-tree-based logic** for fertilizer recommendations.
- **Weather-related inputs** to support crop analysis.
- **Firebase services** for application authentication and data-related functionality.
- **A multilingual interface** supporting English, Hindi, and Marathi.

The goal is to make AI-assisted vineyard analysis more accessible through a straightforward web experience.

> **Note:** HaritGrapes provides estimates and recommendations for decision support. Its outputs should not be treated as guaranteed harvest quantities or substitutes for professional agricultural advice.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🍇 Grape Cluster Detection | Uses an ONNX computer vision model to detect grape clusters in uploaded images. |
| 🔢 Cluster Counting | Processes model detections to produce an estimated cluster count. |
| 📊 Yield Estimation | Uses a machine learning model and vineyard-related inputs to estimate grape yield. |
| 🌿 Fertilizer Recommendations | Uses a decision-tree model and application logic to generate fertilizer recommendations. |
| 🌦️ Environmental Inputs | Incorporates factors such as temperature, humidity, rainfall, wind, and UV index into the yield-estimation workflow. |
| 🌐 Multilingual Interface | Supports English, Hindi, and Marathi. |
| 🔐 Authentication | Integrates Firebase Authentication. |
| ☁️ Firebase Integration | Uses Firebase services for supported application and data workflows. |
| 📈 Data Visualization | Uses Recharts to display supported information and insights. |
| 📄 PDF Generation | Uses jsPDF for supported PDF-generation functionality. |
| 📱 Responsive Interface | Uses modern frontend technologies to provide an accessible web interface across different screen sizes. |

*Feature availability may depend on the configured backend and deployed environment.*

---

## 🌐 Live Demo

Try the deployed application:

### **[🚀 Open HaritGrapes](https://haritgrapes.netlify.app/)**

The deployment provides access to the HaritGrapes web interface. Availability of individual features depends on the configuration and availability of their corresponding backend services.

---

## 🛠️ Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 18 | Component-based user interface |
| TypeScript | Type safety and maintainable frontend code |
| Vite | Development server and frontend build tooling |
| Tailwind CSS | Utility-first styling |
| React Router | Client-side navigation |
| Recharts | Charts and data visualization |
| Framer Motion | UI animations and transitions |
| Firebase SDK | Integration with Firebase services |
| jsPDF | PDF generation |

### Backend

| Technology | Purpose |
|---|---|
| Python | Backend and machine learning integration |
| Flask | HTTP API for inference and application operations |
| ONNX Runtime | Execution of the grape cluster detection model |
| XGBoost | Machine learning model used for yield estimation |
| Joblib | Loading serialized machine learning artifacts |
| Firebase Cloud Functions | Serverless backend functionality |

### Database and Cloud Services

| Technology | Purpose |
|---|---|
| Firebase Authentication | User authentication |
| Cloud Firestore | Document-based data storage where configured |
| Firebase Storage | File storage where configured |
| Firebase Hosting | Hosting configuration for Firebase deployments |
| Netlify | Deployment of the live frontend |

### Development and Tooling

- Git and GitHub for version control.
- npm for frontend package management.
- Python virtual environments for backend dependencies.
- Vite for local frontend development.

---

## 🏗️ System Architecture

HaritGrapes consists of a web frontend, backend API functionality, machine learning models, and Firebase integrations.

```text
                    ┌─────────────────────────┐
                    │        User             │
                    │   Grower / Researcher   │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │    React + TypeScript   │
                    │       Frontend          │
                    │                         │
                    │  • User Interface       │
                    │  • Cluster Analysis     │
                    │  • Yield Estimation     │
                    │  • Recommendations      │
                    └────────────┬────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ▼                         ▼
        ┌─────────────────────┐   ┌─────────────────────┐
        │   Flask Backend     │   │ Firebase Services   │
        │                     │   │                     │
        │ • REST API          │   │ • Authentication    │
        │ • Model Inference   │   │ • Firestore         │
        │ • Prediction Logic  │   │ • Storage           │
        └──────────┬──────────┘   │ • Cloud Functions   │
                   │              └─────────────────────┘
                   ▼
        ┌─────────────────────────────┐
        │       ML Model Layer        │
        │                             │
        │ • ONNX Cluster Detection    │
        │ • XGBoost Yield Estimation  │
        │ • Decision Tree Model       │
        └─────────────────────────────┘
```

### Architecture Notes

- The frontend is built with React, TypeScript, and Vite.
- The Flask backend provides HTTP endpoints for supported inference operations.
- The ONNX model is used for grape cluster detection.
- The yield estimation workflow uses an XGBoost model and vineyard-related inputs.
- Fertilizer recommendations use a serialized decision-tree artifact.
- Firebase provides authentication and other configured cloud functionality.
- Firebase Cloud Functions are a separate backend implementation. Their behavior should be evaluated independently from the Flask API.

**Deployment consideration:** Deploying the frontend does not automatically deploy the Flask backend or make local model files available to the deployed application. Any feature that depends on the Flask API requires an accessible, correctly configured backend. Firebase Cloud Functions must also be deployed and configured separately.

---

## 🤖 Machine Learning Models

HaritGrapes integrates three model artifacts for different agricultural analysis tasks.

### 1. Grape Cluster Detection

**Model artifact:** `grape_cluster_final.onnx`

**Purpose:** Detect grape clusters in images and estimate their count.

#### Workflow

1. The user provides a grapevine image.
2. The image is preprocessed for model input.
3. The ONNX model produces detection predictions.
4. Confidence filtering and non-maximum suppression are applied.
5. The remaining detections are used to calculate the estimated cluster count.
6. The result is returned to the application.

#### Technical Details

- Model format: ONNX.
- Inference runtime: ONNX Runtime.
- Image preprocessing includes resizing and letterboxing to a 640 × 640 input size.
- Detection post-processing includes confidence filtering and non-maximum suppression.

#### Important Considerations

The returned count represents the number of accepted detections, not necessarily the exact number of physical grape bunches.

Overlapping clusters, occlusion, lighting conditions, image quality, and model limitations can affect the result. In particular, multiple bunches may be represented by a single detection.

Model accuracy should be evaluated against manually annotated images collected under representative vineyard conditions.

### 2. Grape Yield Estimation

**Model artifact:** `niphad_yield_2025_model_WEB.json`

**Purpose:** Estimate grape yield from environmental and vineyard-related inputs.

The current workflow uses the following seven input features:

| Feature | Description |
|---|---|
| Temperature | Temperature value supplied to the model |
| Humidity | Humidity value supplied to the model |
| Rainfall | Rainfall value supplied to the model |
| Wind | Wind-related input |
| UV Index | Ultraviolet index input |
| Cluster Count per Acre | Vineyard cluster-count input |
| Average Cluster Weight (g) | Average grape cluster weight in grams |

The model uses these inputs to produce a yield estimate.

#### Important Considerations

The reliability of the output depends on the training dataset, feature definitions, units, preprocessing, and the conditions under which the model is used.

The model's name alone does not establish its accuracy or suitability for every vineyard. Before using predictions for agricultural or commercial decisions, the model should be evaluated against actual harvest records.

### 3. Fertilizer Recommendation

**Model artifact:** `recommendation_tree.joblib`

**Purpose:** Support fertilizer recommendations through a serialized decision-tree model and associated application logic.

The backend loads the saved model and uses the configured recommendation workflow to produce an output.

#### Important Considerations

Fertilizer requirements vary according to soil composition, crop stage, grape variety, irrigation, climate, and existing nutrient levels.

Recommendations should therefore be validated against agronomic requirements and, where appropriate, soil and leaf analysis. The model's presence does not independently establish the agronomic accuracy of its recommendations.

---

## 📁 Project Structure

The following structure represents the main application components. Individual files may differ depending on the current repository version.

```text
HaritGrapes/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── assets/
│   │   └── ...
│   ├── package.json
│   ├── vite.config.ts
│   └── ...
│
├── backend/
│   ├── app.py
│   ├── functions/
│   ├── grape_cluster_final.onnx
│   ├── niphad_yield_2025_model_WEB.json
│   ├── recommendation_tree.joblib
│   └── ...
│
├── firebase.json
├── .gitignore
└── README.md
```

**Note:** This is a high-level overview rather than an exhaustive file listing. Refer to the repository for the exact current directory structure.

---

## 🚀 Getting Started

Follow these instructions to run the application locally.

### Prerequisites

Install the following tools:

- **Git**
- **Node.js and npm**
- **Python 3.10 or a version supported by the backend dependencies**
- **pip**
- A Firebase project for Firebase-dependent features

Python and Node.js version requirements should be checked against the project's dependency files.

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd HaritGrapes
```

Replace `<YOUR_GITHUB_REPOSITORY_URL>` with the actual repository URL.

### 2. Configure the Frontend

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

If the project requires frontend environment variables, configure them as described in the [Environment Configuration](#-environment-configuration) section.

### 3. Configure the Backend

Open another terminal and navigate to the backend directory:

```bash
cd backend
```

Create a Python virtual environment:

```bash
python -m venv .venv
```

Activate it.

**macOS / Linux:**

```bash
source .venv/bin/activate
```

**Windows PowerShell:**

```powershell
.venv\Scripts\Activate.ps1
```

Install the backend dependencies using the project's dependency file, if present:

```bash
pip install -r requirements.txt
```

If the repository does not contain a `requirements.txt`, install the dependencies listed in the backend's actual dependency configuration instead.

Typical dependencies for the described backend may include Flask, ONNX Runtime, NumPy, Joblib, and XGBoost. Use versions compatible with the existing model artifacts and code.

### 4. Verify the Model Artifacts

Confirm that the required model files exist at the paths expected by the backend:

```text
grape_cluster_final.onnx
niphad_yield_2025_model_WEB.json
recommendation_tree.joblib
```

The backend must be able to read these files before the corresponding inference endpoints can operate.

### 5. Configure Firebase

Create or select a Firebase project and configure the services required by the application.

Depending on the features you use, this may include:

- Firebase Authentication
- Cloud Firestore
- Firebase Storage
- Firebase Cloud Functions

Configure the frontend Firebase SDK using the appropriate environment variables. Deploy Cloud Functions separately if they are required.

Refer to the official [Firebase documentation](https://firebase.google.com/docs) for setup instructions.

---

## ⚙️ Environment Configuration

Do not commit private credentials, service-account files, or production secrets to Git.

### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory if the frontend expects environment variables.

A typical Vite Firebase configuration may look like this:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Use the exact variable names expected by the existing frontend code. The example above is illustrative and may need to be adapted.

Vite exposes variables prefixed with `VITE_` to client-side code. These variables must not contain private server credentials.

Firebase web configuration is designed to identify a client application; it is not equivalent to a Firebase service-account private key. Nevertheless, protect your application by configuring appropriate Firebase Security Rules, restricting API keys where applicable, and enforcing authorization on sensitive operations.

### Backend Environment Variables

If the backend uses configurable settings, store them in environment variables or an untracked local environment file.

For example:

```env
FLASK_DEBUG=false
```

Add any additional variables required by the actual backend implementation.

Never commit service-account private keys, passwords, access tokens, or other sensitive credentials.

Ensure that local environment files are excluded through `.gitignore`.

---

## ▶️ Running the Application

### Start the Backend

From the `backend/` directory, activate your virtual environment and run:

```bash
python app.py
```

The Flask application is configured to run on port `7000`.

Confirm that the startup output indicates the server is running and check the routes implemented in `app.py` for the available API endpoints.

### Start the Frontend

From the `frontend/` directory, run:

```bash
npm run dev
```

Vite will print the local development URL in the terminal, commonly:

```text
http://localhost:5173
```

Open the URL printed by Vite in your browser.

### Connect the Frontend to the Backend

Ensure that the frontend's API base URL points to the running Flask backend or to the intended deployed API.

For local development, this may be:

```text
http://localhost:7000
```

Use the actual API configuration supported by the project. If the frontend is deployed on Netlify, it cannot reach a developer's `localhost` backend from a visitor's browser.

A deployed backend must also be configured with the required model files, dependencies, environment variables, and appropriate network access.

### Build the Frontend for Production

From the `frontend/` directory:

```bash
npm run build
```

Vite generates a production build in the configured output directory, typically `dist/`.

To preview the production build locally:

```bash
npm run preview
```

Use the exact build scripts defined in `frontend/package.json`.

---

## 🔄 Application Workflow

### Grape Cluster Detection

```text
Upload Image
     │
     ▼
Image Preprocessing
     │
     ▼
ONNX Model Inference
     │
     ▼
Confidence Filtering
     │
     ▼
Non-Maximum Suppression
     │
     ▼
Estimated Cluster Count
```

### Yield Estimation

```text
Environmental Inputs
        +
Vineyard-Related Inputs
        │
        ▼
Feature Preparation
        │
        ▼
Yield Estimation Model
        │
        ▼
Estimated Yield
```

### Fertilizer Recommendation

```text
Configured Recommendation Inputs
              │
              ▼
    Decision-Tree Model
              │
              ▼
 Recommendation Logic
              │
              ▼
   Fertilizer Recommendation
```

These workflows describe the intended model-processing stages. Actual behavior depends on the implementation and backend selected by the running application.

---

## 🔐 Security Considerations

Security is important for applications that handle user accounts, uploaded images, and agricultural data.

Recommended practices include:

- Keep private credentials and service-account keys out of source control.
- Use environment variables or a suitable secrets manager for server-side secrets.
- Configure Firebase Authentication appropriately.
- Apply restrictive Firestore and Storage Security Rules.
- Validate uploaded files, file types, and file sizes.
- Enforce authorization for protected backend operations.
- Restrict cross-origin requests to trusted origins where practical.
- Avoid exposing debug mode in production.
- Use HTTPS for production API communication.
- Review GitHub secret-scanning alerts and rotate credentials that are genuinely sensitive and have been exposed.
- Apply appropriate API-key restrictions and usage limits where supported.

Frontend configuration values should not be treated as server-side secrets. Security must be enforced by the relevant backend and Firebase rules rather than relying on the frontend alone.

---

## 🧪 Limitations and Validation

HaritGrapes is an AI-assisted agricultural application. Its outputs are estimates and should be validated before being used for operational decisions.

### Cluster Detection

- Overlapping grape bunches may be detected as one cluster.
- Occlusion and poor lighting may affect detection.
- Results may vary with camera angle, image resolution, and vineyard conditions.
- A detection count is not automatically equivalent to a ground-truth count.

### Yield Estimation

- Estimates depend on input quality and model training data.
- Environmental measurements must use the expected units.
- Predictions should be compared with actual harvest results.
- Performance may vary across grape varieties, locations, seasons, and vineyard-management practices.

### Fertilizer Recommendations

- Model outputs may not account for every agronomic factor.
- Recommendations should be checked against soil conditions and crop requirements.
- Local agricultural expertise should guide high-impact nutrient-management decisions.

### Backend and Deployment

- The Flask API and Firebase Cloud Functions are separate implementations.
- A feature implemented in one backend is not necessarily implemented identically in the other.
- Frontend deployment does not guarantee that inference endpoints or model artifacts are available.
- Each deployed feature should be tested against its actual backend before being described as fully operational.

### Model Evaluation

Where appropriate, evaluate the models using representative data and documented metrics.

Potential evaluation methods include:

- **Object detection:** precision, recall, and mean Average Precision (mAP).
- **Cluster counting:** mean absolute error between predicted and manually counted clusters.
- **Yield estimation:** MAE, RMSE, and R² against recorded harvest data.
- **Fertilizer recommendations:** agronomic review and evaluation against relevant soil, crop, and nutrient-management data.

Do not report accuracy percentages or performance guarantees without supporting evaluation results.

---

## 🗺️ Future Improvements

Potential directions for future development include:

- [ ] Evaluate cluster detection against manually annotated vineyard images.
- [ ] Improve counting in images containing overlapping or partially hidden clusters.
- [ ] Validate yield estimates against actual harvest records.
- [ ] Improve the calibration and documentation of environmental inputs.
- [ ] Evaluate fertilizer recommendations with agricultural experts.
- [ ] Integrate reliable weather data sources where appropriate.
- [ ] Improve error handling and backend availability monitoring.
- [ ] Add automated tests for API endpoints and model inference.
- [ ] Improve accessibility and multilingual user experience.
- [ ] Add model-version tracking and prediction logging where appropriate.
- [ ] Strengthen deployment automation and continuous integration.
- [ ] Document production infrastructure and backend deployment requirements.

These items are potential improvements, not claims that the functionality is already implemented.

---

## 🤝 Contributing

Contributions, bug reports, and suggestions are welcome.

To contribute:

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Run the relevant tests and checks.
5. Commit your changes with a clear message.
6. Open a pull request describing the changes.

Example:

```bash
git checkout -b feature/your-feature
git add .
git commit -m "Add: describe your change"
git push origin feature/your-feature
```

For significant changes, consider opening an issue first to discuss the proposed approach.

When contributing changes to machine learning functionality, document the relevant model artifact, input features, preprocessing requirements, and evaluation results.

---

## 📄 License

Add the project's actual license before distributing or reusing the code.

If the repository already includes a `LICENSE` file, refer to that file for the applicable terms. Do not assume that the project is open source or that others have permission to reuse it without checking the license.

---

## 👨‍💻 Author

**Anmol Dinesh Pandey**

- **Project:** HaritGrapes
- **Live Demo:** [https://haritgrapes.netlify.app/](https://haritgrapes.netlify.app/)
- **GitHub:** Add your GitHub profile or repository URL here.
- **Contact:** Add a preferred contact method if you want to make one public.

---

<div align="center">

**🍇 HaritGrapes — Supporting Smarter Vineyard Monitoring Through AI**

*Built to explore the practical application of computer vision and machine learning in grape cultivation.*

</div>
