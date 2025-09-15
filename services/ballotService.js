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