const express = require('express');
const cors = require('cors');
const reportRoutes = require('./routes/report');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/report', reportRoutes);

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
