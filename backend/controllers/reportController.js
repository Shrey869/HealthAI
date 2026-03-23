const axios = require('axios');
const FormData = require('form-data');

const uploadReport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileBuffer = req.file.buffer;
    const fileName = req.file.originalname;

    // Prepare form data to send to Python FastAPI service
    const formData = new FormData();
    formData.append('file', fileBuffer, fileName);

    // Call AI Service
    // We assume the FastAPI service runs on port 8000
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000/analyze-report';
    
    const response = await axios.post(aiServiceUrl, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      timeout: 30000 // 30 second timeout for OCR and AI analysis
    });

    return res.status(200).json(response.data);

  } catch (error) {
    console.error('Error in uploadReport:', error?.response?.data || error.message);
    return res.status(500).json({ 
      error: 'Failed to analyze report', 
      details: error?.response?.data || error.message 
    });
  }
};

module.exports = {
  uploadReport
};
