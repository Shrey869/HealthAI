const axios = require('axios');

const analyzeSymptoms = async (req, res) => {
  try {
    const { symptoms, ageGroup } = req.body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({ error: 'At least one symptom is required' });
    }

    // Forward to Python FastAPI service
    const aiServiceUrl = process.env.AI_SERVICE_URL
      ? process.env.AI_SERVICE_URL.replace('/analyze-report', '/analyze-symptoms')
      : 'http://127.0.0.1:8000/analyze-symptoms';

    const response = await axios.post(aiServiceUrl, {
      symptoms,
      ageGroup: ageGroup || 'Adult',
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000,
    });

    return res.status(200).json(response.data);

  } catch (error) {
    console.error('Error in analyzeSymptoms:', error?.response?.data || error.message);
    return res.status(500).json({
      error: 'Failed to analyze symptoms',
      details: error?.response?.data || error.message,
    });
  }
};

module.exports = { analyzeSymptoms };
