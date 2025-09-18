const express = require('express');
const router = express.Router();
const ballotService = require('../services/ballotService');

// POST /api/ballots/encrypted - Accept encrypted ballots (Q16)
router.post('/encrypted', async (req, res) => {
  try {
    const {
      election_id,
      ciphertext,
      zk_proof,
      voter_pubkey,
      nullifier,
      signature
    } = req.body;
    
    // Validate required fields
    if (!election_id || !ciphertext || !zk_proof || !voter_pubkey || !nullifier || !signature) {
      return res.status(400).json({
        message: 'All fields are required: election_id, ciphertext, zk_proof, voter_pubkey, nullifier, signature'
      });
    }
    
    const encryptedBallot = ballotService.submitEncryptedBallot({
      election_id,
      ciphertext,
      zk_proof,
      voter_pubkey,
      nullifier,
      signature
    });
    
    // Return the exact format shown in the demo
    res.status(236).json({
      ballot_id: encryptedBallot.ballot_id,
      status: "accepted",
      nullifier: encryptedBallot.nullifier,
      anchored_at: encryptedBallot.anchored_at
    });
  } catch (error) {
    if (error.message.includes('invalid zk proof')) {
      res.status(425).json({
        message: "invalid zk proof"
      });
    } else if (error.message.includes('nullifier already used')) {
      res.status(425).json({
        message: error.message
      });
    } else {
      res.status(425).json({
        message: error.message
      });
    }
  }
});

// GET /api/ballots/encrypted - Get encrypted ballots for election
router.get('/encrypted', async (req, res) => {
  try {
    const { election_id } = req.query;
    
    if (!election_id) {
      return res.status(400).json({
        message: 'election_id query parameter is required'
      });
    }
    
    const ballots = ballotService.getEncryptedBallots(election_id);
    res.status(200).json({
      ballots: ballots,
      count: ballots.length
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// POST /api/ballots/ranked - Submit ranked ballots for Condorcet (Schulze) method (Q19)
router.post('/ranked', async (req, res) => {
  try {
    const {
      election_id,
      voter_id,
      ranking,
      timestamp
    } = req.body;
    
    // Validate required fields
    if (!election_id || voter_id === undefined || !ranking || !timestamp) {
      return res.status(400).json({
        message: 'All fields are required: election_id, voter_id, ranking, timestamp'
      });
    }
    
    // Validate ranking array
    if (!Array.isArray(ranking) || ranking.length === 0) {
      return res.status(400).json({
        message: 'ranking must be a non-empty array'
      });
    }
    
    const rankedBallot = ballotService.submitRankedBallot({
      election_id,
      voter_id,
      ranking,
      timestamp
    });
    
    // Return status 239 Ranked with exact format from the image
    res.status(239).json({
      ballot_id: rankedBallot.ballot_id,
      status: "accepted"
    });
  } catch (error) {
    if (error.message.includes('already voted')) {
      res.status(409).json({
        message: error.message
      });
    } else if (error.message.includes('invalid ranking')) {
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

module.exports = router;