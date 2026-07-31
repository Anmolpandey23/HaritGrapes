#  HaritGrapes — AI for Smart Vineyards

HaritGrapes is a full-stack, AI-powered platform that helps grape growers monitor vineyard health, count fruit clusters, predict yield, and get fertilizer/disease treatment recommendations — all from a phone camera. It's built for the Maharashtra grape belt (the yield model is trained on Niphad, Nashik data) with a multilingual UI in **English, Hindi, and Marathi**.

> ⚠️ **Project status:** Actively developed / demo stage. Some Cloud Functions (disease detection, yield, fertilizer) currently return **mock/simulated predictions** for demo purposes, while the standalone Flask backend serves **real trained models** (ONNX cluster-counting model + XGBoost yield model + a fertilizer decision tree). See [Architecture](#-architecture) below for exactly what's real vs. mocked.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🍇 **Cluster Counting** | Upload/scan a vineyard image; a YOLO-style object-detection model (exported to ONNX) counts grape clusters in the frame. |
| 🩺 **Disease Detection** | Scan a leaf/plant photo to flag conditions like Downy Mildew, Powdery Mildew, Bacterial Rot, and Anthracnose. |
| 📈 **Yield Prediction** | An XGBoost regression model estimates expected yield (kg) from weather (temperature, humidity, rainfall, wind, UV) plus cluster count/weight. |
| 🌱 **Fertilizer Recommendation** | Given a detected disease (or a healthy reading), get a dosage, advice, and application schedule using a trained decision-tree classifier. |
| 📊 **Dashboard** | At-a-glance stats: total scans, healthy vs. diseased ratio, average yield, and history. |
| 📄 **PDF Reports** | Generate and download a summary report of scan history using `jsPDF` / `jspdf-autotable`. |
| 🔐 **Authentication & Profiles** | Firebase Authentication with per-user profile documents in Firestore. |
| 🌐 **Multilingual UI** | Full i18n support for English, Hindi (हिंदी), and Marathi (मराठी) via `i18next`. |
| 📚 **Learning Hub** | In-app educational videos/resources for growers. |
| 📷 **Camera Scanner** | In-browser camera capture component for on-the-spot scanning (no need to leave the app). |

---

## 🏗 Architecture

HaritGrapes is split into two independently runnable backends and one frontend:

```
HaritGrapes/
├── frontend/                  # React + TypeScript + Vite SPA
│   └── src/
│       ├── pages/             # Route-level pages (Dashboard, Cluster, Yield, Disease, Fertilizer, Auth, ...)
│       ├── components/        # Header, Footer, CameraScanner, ReportDownloader, YieldChart, ...
│       ├── firebase/          # Firebase app + Firestore service helpers
│       ├── locales/           # en.json / hi.json / mr.json translation files
│       └── routes/            # AppRouter with protected/public routes
│
├── backend/                   # Two backend implementations, both used by the app
│   ├── app.py                 # Flask microservice — REAL model inference (ONNX + XGBoost + joblib)
│   ├── requirements.txt
│   ├── firestore.rules        # Per-user data isolation rules
│   ├── firestore.indexes.json
│   ├── storage.rules
│   └── functions/             # Firebase Cloud Functions (Node.js) — deployed serverless API
│       └── src/
│           ├── auth/          # createUserProfile / updateUserProfile (Firestore writes)
│           ├── cluster/       # predictCluster.js — real ONNX inference via onnxruntime-node
│           ├── disease/       # predictDisease.js — currently mocked/randomized response
│           ├── yield/         # predictYield.js — currently mocked/randomized response
│           └── fertilizer/    # recommendFertilizer.js — currently a mock lookup table
│
├── firebase.json              # Hosting config, serves frontend/dist
└── package.json                # Root-level deps (jsPDF etc. shared with report generation)
```

### Two parallel APIs

The project currently ships **two backend surfaces that serve overlapping purposes**:

1. **Flask service (`backend/app.py`)** — runs real inference:
   - `POST /predict-cluster` — takes an uploaded image, runs `grape_cluster_final.onnx` (a YOLO-style detector) through `onnxruntime`, applies NMS, and returns a cluster count.
   - `POST /predict-yield` — takes a 7-feature vector (`temperature_C`, `humidity_%`, `rainfall_mm`, `wind_speed_mps`, `uv_index`, `cluster_count_per_acre`, `avg_cluster_weight_g`) and returns a predicted yield via a trained XGBoost booster (`niphad_yield_2025_model_WEB.json`).
   - `POST /recommend-fertilizer` — takes a disease name (or "healthy") and returns dosage/advice/application guidance from a trained `joblib` decision tree plus a curated treatment lookup table.
   - `GET /health` — basic health check.

2. **Firebase Cloud Functions (`backend/functions`)** — the deployed serverless API the hosted frontend talks to:
   - `predictCluster` — real ONNX inference (Node port of the same idea as the Flask route, using `onnxruntime-node` + `sharp` for image preprocessing).
   - `predictDisease`, `predictYield`, `recommendFertilizer` — currently **mocked**: they return randomized/simulated results as placeholders until production models are wired in (explicitly noted in `backend/README.md`).
   - `createUserProfile`, `updateUserProfile` — real callable functions that write to Firestore under `users/{uid}/profile/info`.

All Firestore access is scoped so a user can only read/write their own `users/{uid}` subtree (`profile`, `scans`, `yield`, `fertilizer`); a separate `support_contacts` collection allows public write-only submissions (e.g. a contact/support form).

---

## 🧰 Tech Stack

**Frontend**
- React 18 + TypeScript, built with Vite
- Tailwind CSS
- `react-router-dom` for routing (with protected/public route guards)
- `react-i18next` / `i18next` for localization
- `firebase` + `react-firebase-hooks` for auth state
- `recharts` for yield charts, `framer-motion` for animation
- `jsPDF` + `jspdf-autotable` for PDF report generation
- `@tensorflow/tfjs` (client-side ML tooling)
- `react-hot-toast`, `react-icons`

**Backend (Flask microservice)**
- Flask + Flask-CORS
- `onnxruntime` for the cluster-detection model
- `xgboost` for the yield model
- `scikit-learn` / `joblib` for the fertilizer decision tree
- `Pillow` (PIL) + `numpy` for image preprocessing

**Backend (Firebase Cloud Functions)**
- Node.js, `firebase-functions` / `firebase-admin`
- `onnxruntime-node` + `sharp` for server-side image inference
- `axios` for downloading images from Firebase Storage URLs
- `uuid` for scan/record IDs

**Infrastructure**
- Firebase Hosting (serves `frontend/dist`)
- Firebase Authentication
- Cloud Firestore (per-user data) + Firestore security rules
- Firebase Storage (rules included for scan image uploads)

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS) and npm
- [Python 3.9+](https://www.python.org/) for the Flask inference service
- A [Firebase](https://firebase.google.com/) project (for Auth, Firestore, Storage, Hosting, and Cloud Functions)
- `firebase-tools` CLI: `npm install -g firebase-tools`

### 1. Clone the repository

```bash
git clone https://github.com/Anmolpandey23/HaritGrapes.git
cd HaritGrapes
```

### 2. Configure Firebase

Create a Firebase project and add your web app config to:

```
frontend/src/firebase/firebaseConfig.ts
```

Enable **Authentication** (Email/Password and/or your preferred providers), **Firestore**, and **Storage** in the Firebase console.

### 3. Run the frontend + local inference API together

```bash
cd frontend
npm install
npm run dev
```

`npm run dev` uses `concurrently` to start both:
- `npm run frontend` → Vite dev server (the React app)
- `npm run backend` → `cd ../backend && python app.py` (the Flask inference API on port `7000`)

Set `VITE_API_URL` in a `.env` file inside `frontend/` if your Flask API isn't running on `http://localhost:7000`.

### 4. Run the Flask API standalone (optional)

```bash
cd backend
pip install -r requirements.txt
python app.py
```

The service listens on port `7000` by default (override with the `PORT` env var) and exposes `/predict-cluster`, `/predict-yield`, `/recommend-fertilizer`, and `/health`.

> Note: `app.py` expects trained model artifacts at `backend/functions/src/cluster/models/grape_cluster_final.onnx`, `backend/functions/src/yield/model/niphad_yield_2025_model_WEB.json`, and `backend/functions/src/fertilizer/model/recommendation_tree.joblib`. Make sure these are present before starting the service.

### 5. Deploy Cloud Functions / Firestore / Storage rules

```bash
cd backend
firebase login
firebase init            # if not already linked to your Firebase project
cd functions && npm install
cd ..
firebase deploy --only functions,firestore,storage
```

### 6. Build & deploy the frontend to Firebase Hosting

```bash
cd frontend
npm run build             # outputs to frontend/dist
cd ..
firebase deploy --only hosting
```

---

## 🧪 Available Scripts

**Frontend (`frontend/package.json`):**

```bash
npm run dev        # run Vite dev server + Flask API concurrently
npm run frontend    # Vite dev server only
npm run backend     # Flask API only
npm run build       # production build → frontend/dist
npm run preview     # preview the production build
npm run lint        # ESLint over src/**.ts(x)
```

**Cloud Functions (`backend/functions/package.json`):**

```bash
npm run serve       # firebase emulators:start --only functions
npm run deploy       # firebase deploy --only functions
```

---

## 🔐 Data Model & Security

Firestore is structured per user:

```
users/{uid}/
├── profile/info        # name, email, photoURL, language
├── scans/{scanId}       # disease-detection & cluster-count scan history
├── yield/{yieldId}      # yield prediction records
└── fertilizer/{fertilizerId}  # fertilizer recommendation records

support_contacts/{contactId}   # public write-only support/contact form submissions
```

`firestore.rules` enforces that a user may only read/write their own `users/{uid}` subtree; `support_contacts` allows anonymous creation but no read/update/delete access from clients.

---

## 🌐 Localization

The UI ships with translation bundles for:
- 🇬🇧 English (`en.json`)
- 🇮🇳 Hindi (`hi.json`)
- 🇮🇳 Marathi (`mr.json`)

Language is selectable at onboarding (`/language`) and stored as part of the user's profile so the experience is consistent across sessions and devices. Add a new language by dropping a translation JSON into `frontend/src/locales/` and registering it in `frontend/src/i18n.ts`.

---

## 🗺 Roadmap

- [ ] Replace mocked disease-detection, yield, and fertilizer Cloud Functions with production ML models (parity with the real models already used in the Flask service)
- [ ] Consolidate the Flask microservice and Cloud Functions into a single deployment target
- [ ] Add automated tests for both frontend components and backend inference routes
- [ ] Expand the fertilizer recommendation dataset and disease taxonomy
- [ ] Add offline/PWA support for low-connectivity vineyard environments
- [ ] CI/CD pipeline for Firebase Hosting + Functions deployment

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

Released under the **MIT License**. See [`LICENSE`](./LICENSE) for details.

Copyright (c) 2025 Anmol Dinesh Pandey

---

## 🙋 Support

In-app support/contact page (`/support`) submits directly to a Firestore `support_contacts` collection. For code-level issues, please open a GitHub issue on the repository.
