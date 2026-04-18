const axios = require('axios');

// AI_SERVICE_BASE_URL = base URL of the Python FastAPI service, no trailing slash
// e.g. https://healthai-ai.onrender.com
const AI_BASE = (process.env.AI_SERVICE_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');

const analyzeSymptoms = async (req, res) => {
  try {
    const { symptoms, ageGroup } = req.body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({ error: 'At least one symptom is required' });
    }

    const url = `${AI_BASE}/analyze-symptoms`;
    console.log(`[symptomController] POST ${url}`);

    const response = await axios.post(url, {
      symptoms,
      ageGroup: ageGroup || 'Adult',
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000,
    });

    return res.status(200).json(response.data);

  } catch (error) {
    const detail = error?.response?.data || error.message;
    console.error('[symptomController] Error:', detail);
    return res.status(500).json({
      error: 'Failed to analyze symptoms',
      details: detail,
    });
  }
};

module.exports = { analyzeSymptoms };
