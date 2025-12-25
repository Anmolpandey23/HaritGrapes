const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { predictDisease } = require('./src/disease/predictDisease');
const { predictCluster } = require('./src/cluster/predictCluster');
const { predictYield } = require('./src/yield/predictYield');
const { recommendFertilizer } = require('./src/fertilizer/recommendFertilizer');
const { createUserProfile } = require('./src/auth/createUserProfile');
const { updateUserProfile } = require('./src/auth/updateUserProfile');

admin.initializeApp();

// Auth functions
exports.createUserProfile = functions.https.onCall(createUserProfile);
exports.updateUserProfile = functions.https.onCall(updateUserProfile);

// AI endpoints
exports.predictDisease = functions.https.onRequest(predictDisease);
exports.predictCluster = functions.https.onRequest(predictCluster);
exports.predictYield = functions.https.onRequest(predictYield);
exports.recommendFertilizer = functions.https.onRequest(recommendFertilizer);
