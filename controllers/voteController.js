const express = require('express');
const router = express.Router();
const voteService = require('../services/voteService');
const candidateService = require('../services/candidateService');

// POST /api/votes - Cast a vote (Q8)
router.post('/', async (req, res) => {
  try {
    const { voter_id, candidate_id } = req.body;
    
    // Validate input
    if (!voter_id && voter_id !== 0) {
      return res.status(400).json({
        message: 'Voter ID is required'
      });
    }
    
    if (!candidate_id && candidate_id !== 0) {
      return res.status(400).json({
        message: 'Candidate ID is required'
      });
    }

    const newVote = voteService.castVote({ voter_id, candidate_id });
    res.status(228).json({
      vote_id: newVote.vote_id,
      voter_id: newVote.voter_id,
      candidate_id: newVote.candidate_id,
      timestamp: newVote.timestamp.replace(/:/g, ': ')
    });
  } catch (error) {
    if (error.message.includes('has already voted')) {
      res.status(423).json({
        message: error.message
      });
    } else if (error.message.includes('was not found')) {
      res.status(423).json({
        message: error.message
      });
    } else {
      res.status(423).json({
        message: error.message
      });
    }
  }
});

// GET /api/votes - Get all votes (optional endpoint)
router.get('/', async (req, res) => {
  try {
    const votes = voteService.getAllVotes();
    const formattedVotes = votes.map(vote => ({
      ...vote,
      timestamp: vote.timestamp.replace(/:/g, ': ')
    }));
    res.status(200).json({
      votes: formattedVotes,
      count: votes.length
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// GET /api/votes/timeline - Get vote timeline for a candidate (Q13)
router.get('/timeline', async (req, res) => {
  try {
    const { candidate_id } = req.query;
    
    if (!candidate_id) {
      return res.status(400).json({
        message: 'candidate_id query parameter is required'
      });
    }
    
    const candidateIdNum = parseInt(candidate_id);
    if (isNaN(candidateIdNum)) {
      return res.status(400).json({
        message: 'Invalid candidate_id format'
      });
    }
    
    const timeline = voteService.getVoteTimelineForCandidate(candidateIdNum);
    const formattedTimeline = timeline.map(item => ({
      ...item,
      timestamp: item.timestamp.replace(/:/g, ': ')
    }));
    res.status(233).json({
      candidate_id: candidateIdNum,
      timeline: formattedTimeline
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// GET /api/votes/range - Get votes for candidate within time range (Q15)
router.get('/range', async (req, res) => {
  try {
    const { candidate_id, from, to } = req.query;
    
    if (!candidate_id || !from || !to) {
      return res.status(424).json({
        message: 'candidate_id, from, and to query parameters are required'
      });
    }
    
    const candidateIdNum = parseInt(candidate_id);
    if (isNaN(candidateIdNum)) {
      return res.status(424).json({
        message: 'Invalid candidate_id format'
      });
    }
    
    // Validate date format and range
    const fromDate = new Date(from);
    const toDate = new Date(to);
    
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return res.status(424).json({
        message: 'Invalid date format. Use ISO 8601 format'
      });
    }
    
    if (fromDate > toDate) {
      return res.status(424).json({
        message: 'invalid interval: from > to'
      });
    }
    
    // Check if candidate exists
    try {
      candidateService.getCandidateById(candidateIdNum);
    } catch (candidateError) {
      return res.status(424).json({
        message: 'Candidate not found'
      });
    }
    
    const rangeData = voteService.getVotesInRange(candidateIdNum, from, to);
    res.status(235).json({
      candidate_id: candidateIdNum,
      from: from,
      to: to,
      votes_gained: rangeData.votes_gained
    });
  } catch (error) {
    res.status(424).json({
      message: error.message
    });
  }
});

// POST /api/votes/weighted - Cast a weighted vote (Q14)
router.post('/weighted', async (req, res) => {
  try {
    const { voter_id, candidate_id } = req.body;
    
    // Validate input
    if (!voter_id && voter_id !== 0) {
      return res.status(400).json({
        message: 'Voter ID is required'
      });
    }
    
    if (!candidate_id && candidate_id !== 0) {
      return res.status(400).json({
        message: 'Candidate ID is required'
      });
    }

    const weightedVote = voteService.castWeightedVote({ voter_id, candidate_id });
    const formattedWeightedVote = {
      ...weightedVote,
      timestamp: weightedVote.timestamp.replace(/:/g, ': ')
    };
    res.status(234).json(formattedWeightedVote);
  } catch (error) {
    if (error.message.includes('has already voted')) {
      res.status(423).json({
        message: error.message
      });
    } else if (error.message.includes('was not found')) {
      res.status(404).json({
        message: error.message
      });
    } else {
      res.status(400).json({
        message: error.message
      });
    }
  }
});

module.exports = router;