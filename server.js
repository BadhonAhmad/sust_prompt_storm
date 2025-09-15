const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import routes
const userController = require('./controllers/userController');
const projectController = require('./controllers/projectController');
const voterController = require('./controllers/voterController');
const candidateController = require('./controllers/candidateController');
const voteController = require('./controllers/voteController');
const resultsController = require('./controllers/resultsController');
const ballotController = require('./controllers/ballotController');
const analyticsController = require('./controllers/analyticsController');
const auditsController = require('./controllers/auditsController');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to SUST Prompt Storm API!',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      projects: '/api/projects',
      voters: '/api/voters',
      candidates: '/api/candidates',
      votes: '/api/votes',
      results: '/api/results',
      ballots: '/api/ballots',
      analytics: '/api/analytics',
      audits: '/api/audits'
    }
  });
});

// API Routes
app.use('/api/users', userController);
app.use('/api/projects', projectController);
app.use('/api/voters', voterController);
app.use('/api/candidates', candidateController);
app.use('/api/votes', voteController);
app.use('/api/results', resultsController);
app.use('/api/ballots', ballotController);
app.use('/api/analytics', analyticsController);
app.use('/api/audits', auditsController);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The route ${req.originalUrl} does not exist`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 API available at: http://localhost:${PORT}`);
  console.log(`📚 API Documentation at: http://localhost:${PORT}/`);
});

module.exports = app;