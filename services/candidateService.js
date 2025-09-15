const db = require('../database');
const Candidate = require('../models/Candidate');

class CandidateService {
  // Register new candidate
  registerCandidate(candidateData) {
    try {
      // Validate candidate data using model
      const candidateModel = new Candidate(candidateData);
      
      // Create candidate in database
      const newCandidate = db.createCandidate(candidateModel.toJSON());
      return newCandidate;
    } catch (error) {
      throw error;
    }
  }

  // Get candidate by ID
  getCandidateById(candidate_id) {
    const candidate = db.findCandidateById(candidate_id);
    if (!candidate) {
      throw new Error(`candidate with id: ${candidate_id} was not found`);
    }
    return candidate;
  }

  // Get all candidates
  getAllCandidates() {
    return db.candidates;
  }

  // Get candidates by party
  getCandidatesByParty(party) {
    return db.getCandidatesByParty(party);
  }

  // Get voting results
  getVotingResults() {
    return db.getVotingResults();
  }

  // Get winning candidate(s) - handles ties
  getWinners() {
    return db.getWinners();
  }

  // Perform homomorphic tally with verifiable decryption
  performHomomorphicTally(tallyData) {
    try {
      return db.performHomomorphicTally(tallyData);
    } catch (error) {
      throw error;
    }
  }

  // Update candidate votes
  updateCandidateVotes(candidate_id, votes) {
    try {
      const existingCandidate = this.getCandidateById(candidate_id);
      existingCandidate.votes = votes;
      return existingCandidate;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new CandidateService();