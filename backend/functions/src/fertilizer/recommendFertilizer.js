const { v4: uuidv4 } = require('uuid');

// Mock demo fertilizer database.
// You can easily add more mapping logic or load from a real database/model.
const fertilizerDb = [
  { fertilizer: 'NPK 12:32:16', dosage: '2.5 kg/acre', advice: 'Apply pre-flowering for best result.', diseases: ['Downy Mildew'] },
  { fertilizer: 'Zinc Sulphate', dosage: '0.6 kg/acre', advice: 'Corrects micronutrient deficiency.', diseases: ['Leaf Spot'] },
  { fertilizer: 'Urea', dosage: '1.8 kg/acre', advice: 'Promotes healthy vegetative growth.', diseases: ['Powdery Mildew', 'Anthracnose'] },
  { fertilizer: 'DAP', dosage: '2 kg/acre', advice: 'Apply at early fruit set.', diseases: ['Black Rot', 'Botrytis'] }
];

// Logic to select a fertilizer given input features.
function getRecommendation(disease, clusterCount) {
  let rec = null;
  if (disease) {
    rec = fertilizerDb.find(f => f.diseases.includes(disease));
  }
  // Optional extension: Use clusterCount for other logic
  if (!rec) {
    rec = fertilizerDb[Math.floor(Math.random() * fertilizerDb.length)];
  }
  return rec;
}

// Main handler for Express/Node routers
exports.recommendFertilizer = async (req, res) => {
  try {
    // Only POST is allowed
    if (req.method === "GET") {
      return res.status(405).json({ error: 'Use POST with JSON body.' });
    }

    const body = req.body || {};
    const disease = body.disease;
    const clusterCount = body.clusterCount; // Optional

    if (!disease && !clusterCount) {
      return res.status(400).json({ error: 'Missing disease or clusterCount.' });
    }

    const recommendation = getRecommendation(disease, clusterCount);

    res.json({
      fertilizerId: uuidv4(),
      ...recommendation,
      disease,
      clusterCount,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    res.status(500).json({
      error: 'Fertilizer recommendation failed',
      details: err ? err.message : 'Unknown error'
    });
  }
};
