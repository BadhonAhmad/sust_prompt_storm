const express = require('express');
const router = express.Router();
const candidateService = require('../services/candidateService');

// GET /api/results - Get voting results (leaderboard) (Q11)
router.get('/', async (req, res) => {
  try {
    const results = candidateService.getVotingResults();
    res.status(231).json({
      results: results
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// GET /api/results/winner - Get winning candidate(s) (Q12)
router.get('/winner', async (req, res) => {
  try {
    const winners = candidateService.getWinners();
    res.writeHead(232,'winner');
    res.end(JSON.stringify({
      winners: winners
    }));
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// POST /api/results/homomorphic - Homomorphic tally with verifiable decryption (Q17)
router.post('/homomorphic', async (req, res) => {
  try {
    const { election_id, trustee_decrypt_shares } = req.body;
    
    if (!election_id || !trustee_decrypt_shares || !Array.isArray(trustee_decrypt_shares)) {
      return res.status(400).json({
        message: 'election_id and trustee_decrypt_shares array are required'
      });
    }
    
    // Validate trustee shares
    for (const share of trustee_decrypt_shares) {
      if (!share.trustee_id || !share.share || !share.proof) {
        return res.status(400).json({
          message: 'Each trustee share must have trustee_id, share, and proof'
        });
      }
    }
    
    const homomorphicResults = candidateService.performHomomorphicTally({
      election_id,
      trustee_decrypt_shares
    });
    
    res.status(237).json(homomorphicResults);
  } catch (error) {
    if (error.message.includes('insufficient trustees') || error.message.includes('invalid proof')) {
      res.status(400).json({
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