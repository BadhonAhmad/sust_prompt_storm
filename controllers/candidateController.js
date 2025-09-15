const express = require('express');
const router = express.Router();
const candidateService = require('../services/candidateService');

// POST /api/candidates - Register a new candidate
router.post('/', async (req, res) => {
  try {
    const newCandidate = candidateService.registerCandidate(req.body);
    res.status(201).json({
  status: "registered",
  newCandidate
});
  } catch (error) {
    if (error.message.includes('already exists')) {
      res.status(409).json({
        message: error.message
      });
    } else {
      res.status(400).json({
        message: error.message
      });
    }
  }
});

// GET /api/candidates - Get all candidates (Q7 & Q10)
router.get('/', async (req, res) => {
  try {
    const { party } = req.query;
    
    let candidates;
    if (party) {
      // Q10 - Filter candidates by party
      candidates = candidateService.getCandidatesByParty(party);
      res.status(230).json({
        candidates: candidates
      });
    } else {
      // Q7 - List all candidates
      candidates = candidateService.getAllCandidates();
      // Format response to match specification (without votes field for listing)
      const formattedCandidates = candidates.map(candidate => ({
        candidate_id: candidate.candidate_id,
        name: candidate.name,
        party: candidate.party
      }));
      res.status(227).json({
        candidates: formattedCandidates
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// GET /api/candidates/:candidate_id - Get candidate by ID
router.get('/:candidate_id', async (req, res) => {
  try {
    const candidate_id = parseInt(req.params.candidate_id);
    if (isNaN(candidate_id)) {
      return res.status(400).json({
        message: 'Invalid candidate ID format'
      });
    }

    const candidate = candidateService.getCandidateById(candidate_id);
    res.status(200).json(candidate);
  } catch (error) {
    if (error.message.includes('was not found')) {
      res.status(404).json({
        message: error.message
      });
    } else {
      res.status(500).json({
        message: error.message
      });
    }
  }
});

// GET /api/candidates/:candidate_id/votes - Get candidate votes (Q9)
router.get('/:candidate_id/votes', async (req, res) => {
  try {
    const candidate_id = parseInt(req.params.candidate_id);
    if (isNaN(candidate_id)) {
      return res.status(400).json({
        message: 'Invalid candidate ID format'
      });
    }

    const candidate = candidateService.getCandidateById(candidate_id);
    res.status(229).json({
      candidate_id: candidate.candidate_id,
      votes: candidate.votes
    });
  } catch (error) {
    if (error.message.includes('was not found')) {
      res.status(404).json({
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