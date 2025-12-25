const { v4: uuidv4 } = require('uuid');

exports.predictDisease = async (req, res) => {
  try {
    const imageUrl = req.query.imageUrl;
    const uid = req.query.uid;

    if (!imageUrl || !uid) return res.status(400).json({ error: 'Missing imageUrl or uid' });

    // --- Mock prediction logic ---
    // Detected categories: "Healthy", "Downy Mildew", "Powdery Mildew", "Anthracnose"
    const diseases = [
      { name: "Healthy", advice: "No action needed. Maintain regular care." },
      { name: "Downy Mildew", advice: "Spray suitable fungicide. Avoid wetting leaves late in day." },
      { name: "Powdery Mildew", advice: "Ensure good ventilation and use sulfur-based sprays." },
      { name: "Anthracnose", advice: "Remove affected leaves. Use copper fungicide." }
    ];
    const picked = diseases[Math.floor(Math.random() * diseases.length)];
    const confidence = picked.name === "Healthy" ? Math.random() * 0.3 + 0.7 : Math.random() * 0.3 + 0.6;

    res.json({
      scanId: uuidv4(),
      disease: picked.name,
      confidence: +confidence.toFixed(2),
      advice: picked.advice
    });
  } catch (err) {
    res.status(500).json({ error: 'AI prediction failed' });
  }
};
