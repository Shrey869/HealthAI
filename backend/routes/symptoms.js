const express = require('express');
const router = express.Router();
const { analyzeSymptoms } = require('../controllers/symptomController');

router.post('/analyze', analyzeSymptoms);

module.exports = router;
