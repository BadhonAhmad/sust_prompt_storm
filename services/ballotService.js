const db = require('../database');

class BallotService {
  // Submit encrypted ballot with zero-knowledge proof
  submitEncryptedBallot(ballotData) {
    try {
      // Validate zero-knowledge proof (simplified simulation)
      if (!this.validateZKProof(ballotData.zk_proof)) {
        throw new Error('invalid zk proof');
      }
      
      // Check if nullifier already used (prevent double voting)
      if (db.isNullifierUsed(ballotData.nullifier)) {
        throw new Error('nullifier already used - double voting detected');
      }
      
      // Validate signature (simplified simulation)
      if (!this.validateSignature(ballotData)) {
        throw new Error('invalid signature');
      }
      
      // Create encrypted ballot record
      const ballot = db.createEncryptedBallot(ballotData);
      return ballot;
    } catch (error) {
      throw error;
    }
  }
  
  // Get encrypted ballots for election
  getEncryptedBallots(election_id) {
    return db.getEncryptedBallots(election_id);
  }
  
  // Submit ranked ballot for Condorcet (Schulze) method
  submitRankedBallot(ballotData) {
    try {
      const { election_id, voter_id, ranking, timestamp } = ballotData;
      
      // Validate ranking array
      if (!this.validateRanking(ranking)) {
        throw new Error('invalid ranking - must contain valid candidate preferences');
      }
      
      // Check if voter already submitted a ranked ballot
      if (db.hasVoterSubmittedRankedBallot(election_id, voter_id)) {
        throw new Error('voter has already voted in this election');
      }
      
      // Create ranked ballot record
      const ballot = db.createRankedBallot(ballotData);
      return ballot;
    } catch (error) {
      throw error;
    }
  }
  
  // Get ranked ballots for election
  getRankedBallots(election_id) {
    return db.getRankedBallots(election_id);
  }
  
  // Validate ranking array
  validateRanking(ranking) {
    // Check if ranking is array with valid candidate IDs
    if (!Array.isArray(ranking) || ranking.length === 0) {
      return false;
    }
    
    // Check for duplicate candidates in ranking
    const uniqueCandidates = new Set(ranking);
    if (uniqueCandidates.size !== ranking.length) {
      return false;
    }
    
    // All candidates should be numbers/valid IDs
    return ranking.every(candidateId => 
      typeof candidateId === 'number' && candidateId > 0
    );
  }
  
  // Validate zero-knowledge proof (simplified simulation)
  validateZKProof(zk_proof) {
    // For testing purposes, just check if it's a non-empty string
    return zk_proof && typeof zk_proof === 'string' && zk_proof.length > 0;
  }

  // Validate signature (simplified simulation)
  validateSignature(ballotData) {
    // For testing purposes, just check if it's a non-empty string
    return ballotData.signature && typeof ballotData.signature === 'string' && ballotData.signature.length > 0;
  }
}

module.exports = new BallotService();