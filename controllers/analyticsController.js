const express = require('express');
const router = express.Router();
const analyticsService = require('../services/analyticsService');

// POST /api/analytics/dp - Differential privacy analytics (Q18)
router.post('/dp', async (req, res) => {
  try {
    const {
      election_id,
      query,
      epsilon,
      buckets,
      delta
    } = req.body;
    
    // Validate required fields
    if (!election_id || !query || !epsilon || !buckets || !delta) {
      return res.status(400).json({
        message: 'All fields are required: election_id, query, epsilon, buckets, delta'
      });
    }
    
    // Validate query structure
    if (!query.type || !query.dimension) {
      return res.status(400).json({
        message: 'Query must have type and dimension fields'
      });
    }
    
    // Validate epsilon and delta values
    if (epsilon <= 0 || epsilon > 10) {
      return res.status(400).json({
        message: 'Epsilon must be between 0 and 10'
      });
    }
    
    if (delta <= 0 || delta >= 1) {
      return res.status(400).json({
        message: 'Delta must be between 0 and 1'
      });
    }
    
    const dpResults = analyticsService.performDifferentialPrivacyQuery({
      election_id,
      query,
      epsilon,
      buckets,
      delta
    });
    
    res.status(238).json(dpResults);
  } catch (error) {
    if (error.message.includes('privacy budget exceeded')) {
      res.status(429).json({
        message: error.message
      });
    } else if (error.message.includes('insufficient data')) {
      res.status(422).json({
        message: error.message
      });
    } else {
      res.status(400).json({
        message: error.message
      });
    }
  }
});

// GET /api/analytics/budget - Get remaining privacy budget
router.get('/budget', async (req, res) => {
  try {
    const { election_id } = req.query;
    if (!election_id) {
      return res.status(400).json({
        message: 'election_id query parameter is required'
      });
    }
    
    const budget = analyticsService.getPrivacyBudget(election_id);
    res.status(200).json(budget);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;