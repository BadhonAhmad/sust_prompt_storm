// Vote model for validation and structure
class Vote {
  constructor(data) {
    this.validateVoteData(data);
    
    this.vote_id = data.vote_id;
    this.voter_id = data.voter_id;
    this.candidate_id = data.candidate_id;
    this.timestamp = data.timestamp || new Date().toISOString();
  }

  validateVoteData(data) {
    if (!data.vote_id && data.vote_id !== 0) {
      throw new Error('Vote ID is required');
    }
    
    if (typeof data.vote_id !== 'number') {
      throw new Error('Vote ID must be a number');
    }
    
    if (!data.voter_id && data.voter_id !== 0) {
      throw new Error('Voter ID is required');
    }
    
    if (typeof data.voter_id !== 'number') {
      throw new Error('Voter ID must be a number');
    }
    
    if (!data.candidate_id && data.candidate_id !== 0) {
      throw new Error('Candidate ID is required');
    }
    
    if (typeof data.candidate_id !== 'number') {
      throw new Error('Candidate ID must be a number');
    }
  }

  toJSON() {
    return {
      vote_id: this.vote_id,
      voter_id: this.voter_id,
      candidate_id: this.candidate_id,
      timestamp: this.timestamp
    };
  }
}

module.exports = Vote;