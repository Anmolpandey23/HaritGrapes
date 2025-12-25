# HaritGrapes Backend

## Overview

This folder contains all Cloud Functions and configuration for HaritGrapes — AI for Smart Vineyards.

- Each feature (disease detection, cluster counting, yield prediction, fertilizer recommendation) is a Firebase Cloud Function with mock AI logic.
- All user data and scan results are stored securely in Firestore, as per the defined structure and `firestore.rules`.
- Update functions and structure as needed for production deployment.

## Deployment

- Install Tools: `npm install -g firebase-tools`
- Init/Deploy: 
    - `firebase login`
    - `firebase init`
    - `cd functions && npm install`
    - `firebase deploy --only functions,firestore,storage`

## Folder Details

- `functions/` — All source for Cloud Functions (see `src/` for organized modules)
- `firestore.rules` — Security rules: users can only access their own data
- `firestore.indexes.json` — Needed index for querying yield records

## Mock AI

All AI models here simulate results for demo/testing. Replace with real models as needed.

---
