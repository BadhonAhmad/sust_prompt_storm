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
      delta
    } = req.body;
    
    // Extract buckets from query object
    const buckets = query?.buckets;
    
    // Debug logging
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Extracted buckets:', buckets);
    console.log('Validation checks:', {
      election_id: !!election_id,
      query: !!query,
      epsilon: epsilon !== undefined,
      buckets: !!buckets && Array.isArray(buckets),
      delta: delta !== undefined
    });
    
    // Validate required fields - more specific validation
    if (!election_id) {
      return res.status(400).json({
        message: 'election_id is required'
      });
    }
    
    if (!query) {
      return res.status(400).json({
        message: 'query object is required'
      });
    }
    
    if (epsilon === undefined || epsilon === null) {
      return res.status(400).json({
        message: 'epsilon is required'
      });
    }
    
    if (!buckets || !Array.isArray(buckets)) {
      return res.status(400).json({
        message: 'query.buckets array is required'
      });
    }
    
    if (delta === undefined || delta === null) {
      return res.status(400).json({
        message: 'delta is required'
      });
    }
    
    // Validate query structure
    if (!query.type || !query.dimension || !Array.isArray(buckets)) {
      return res.status(400).json({
        message: 'Query must have type, dimension, and buckets array fields'
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
    
    // Return status 238 Private with exact format from the image
    res.status(238).json({
      election_id: dpResults.election_id,
      query_type: dpResults.query_type,
      dimension: dpResults.dimension,
      epsilon_used: dpResults.epsilon_used,
      delta: dpResults.delta,
      results: dpResults.results,
      privacy_budget_remaining: dpResults.privacy_budget_remaining,
      timestamp: dpResults.timestamp
    });
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