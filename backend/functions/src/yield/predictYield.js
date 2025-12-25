const { v4: uuidv4 } = require('uuid');

exports.predictYield = async (req, res) => {
  try {
    const imageUrl = req.query.imageUrl;
    const uid = req.query.uid;
    if (!imageUrl || !uid) return res.status(400).json({ error: 'Missing imageUrl or uid' });

    // --- Mock yield logic ---
    // Estimate yield in kg based on random for demo
    const predictedYield = +(Math.random() * 6 + 7).toFixed(2); // 7-13 kg
    res.json({
      yieldId: uuidv4(),
      predictedYield,
      advice: predictedYield > 10
        ? "Expected good yield. Ensure nutrient supply is adequate."
        : "Potential for improvement. Review irrigation and nutrition."
    });
  } catch (err) {
    res.status(500).json({ error: 'AI yield prediction failed' });
  }
};
