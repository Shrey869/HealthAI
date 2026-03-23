const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadReport } = require('../controllers/reportController');

// Configure multer for memory storage (temporary)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.post('/upload', upload.single('report'), uploadReport);

module.exports = router;
