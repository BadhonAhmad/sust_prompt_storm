const express = require('express');
const router = express.Router();
const voterService = require('../services/voterService');

// POST /api/voters - Create a new voter
router.post('/', async (req, res) => {
  try {
    const newVoter = voterService.createVoter(req.body);
    res.status(218).json(newVoter);
  } catch (error) {
    if (error.message.includes('already exists')) {
      res.status(409).json({
        message: error.message
      });
    } else if (error.message.includes('invalid age')) {
      res.status(409).json({
        message: error.message
      });
    } else {
      res.status(409).json({
        message: error.message
      });
    }
  }
});

// GET /api/voters/:voter_id - Get voter info by ID
router.get('/:voter_id', async (req, res) => {
  try {
    const voter_id = parseInt(req.params.voter_id);
    if (isNaN(voter_id)) {
      return res.status(400).json({
        message: 'Invalid voter ID format'
      });
    }

    const voter = voterService.getVoterById(voter_id);
    res.status(222).json(voter);
  } catch (error) {
    if (error.message.includes('was not found')) {
      res.status(417).json({
        message: error.message
      });
    } else {
      res.status(500).json({
        message: error.message
      });
    }
  }
});

// GET /api/voters - List all voters
router.get('/', async (req, res) => {
  try {
    const voters = voterService.getAllVoters();
    res.status(223).json({
      voters: voters
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// PUT /api/voters/:voter_id - Update voter info
router.put('/:voter_id', async (req, res) => {
  try {
    const voter_id = parseInt(req.params.voter_id);
    if (isNaN(voter_id)) {
      return res.status(400).json({
        message: 'Invalid voter ID format'
      });
    }

    const updatedVoter = voterService.updateVoter(voter_id, req.body);
    res.end();
  } catch (error) {
    if (error.message.includes('was not found')) {
      res.status(422).json({
        message: error.message
      });
    } else if (error.message.includes('invalid age')) {
      res.status(422).json({
        message: error.message
      });
    } else {
      res.status(422).json({
        message: error.message
      });
    }
  }
});

// DELETE /api/voters/:voter_id - Delete voter
router.delete('/:voter_id', async (req, res) => {
  try {
    const voter_id = parseInt(req.params.voter_id);
    if (isNaN(voter_id)) {
      return res.status(400).json({
        message: 'Invalid voter ID format'
      });
    }

    const result = voterService.deleteVoter(voter_id);
    res.statusMessage = "deleted";
    res.status(225).json(result);
  } catch (error) {
    if (error.message.includes('was not found')) {
      res.status(417).json({
        message: error.message
      });
    } else {
      res.status(500).json({
        message: error.message
      });
    }
  }
});

module.exports = router;