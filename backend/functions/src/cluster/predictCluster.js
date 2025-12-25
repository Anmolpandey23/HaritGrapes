const ort = require('onnxruntime-node');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios'); // For downloading the image
const sharp = require('sharp'); // For image processing

const MODEL_PATH = './src/models/grape_cluster_final.onnx';

exports.predictCluster = async (req, res) => {
  try {
    const imageUrl = req.query.imageUrl;
    const uid = req.query.uid;
    if (!imageUrl || !uid) return res.status(400).json({ error: 'Missing imageUrl or uid' });

    // 1. Download image
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    let imgBuffer = Buffer.from(response.data, 'binary');

    // 2. Preprocess for most detection models ([1, 3, 640, 640] and RGB order)
    const size = 640;
    const { data, info } = await sharp(imgBuffer)
      .resize(size, size)
      .raw()
      .toBuffer({ resolveWithObject: true });

    // sharp raw is [R,G,B,R,G,B,...], we convert to [C, H, W]
    // Rearranging buffer into [3, size, size]
    const floatArray = new Float32Array(3 * size * size);
    for (let i = 0; i < size * size; i++) {
      floatArray[i] = data[i * 3] / 255.0; // Red
      floatArray[i + size * size] = data[i * 3 + 1] / 255.0; // Green
      floatArray[i + 2 * size * size] = data[i * 3 + 2] / 255.0; // Blue
    }

    // 3. Run ONNX inference
    const session = await ort.InferenceSession.create(MODEL_PATH);
    const feeds = {};
    feeds[session.inputNames[0]] = new ort.Tensor('float32', floatArray, [1, 3, size, size]);
    const results = await session.run(feeds);
    const output = results[session.outputNames[0]]; // For YOLO/SSD: [1, N, 6]
    const boxes = output.data;
    const nBoxes = output.dims[1]; // e.g., 25200
    const boxDim = output.dims[2]; // quantity (should be 6: x1,y1,x2,y2,score,class or similar)

    // 4. Filter boxes by confidence
    const confThreshold = 0.5;
    let clusterCount = 0;
    let detectedBoxes = [];
    for (let i = 0; i < nBoxes; i++) {
      const idx = i * boxDim;
      const conf = boxes[idx + 5]; // last column is confidence for YOLO/SSD6
      if (conf > confThreshold) {
        clusterCount += 1;
        detectedBoxes.push([
          boxes[idx], boxes[idx + 1], boxes[idx + 2], boxes[idx + 3], conf
        ]);
      }
    }

    res.json({
      scanId: uuidv4(),
      clusterCount,
      advice: clusterCount > 8
        ? "Heavy crop load detected. Consider thinning to improve quality."
        : "Cluster count in safe range.",
      // Uncomment to return bounding boxes as well:
      // boxes: detectedBoxes
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'AI cluster count failed', details: err.toString() });
  }
};
