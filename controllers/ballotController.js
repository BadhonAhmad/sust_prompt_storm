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

module.exports = router;