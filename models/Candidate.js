// Candidate model for validation and structure
class Candidate {
  constructor(data) {
    this.validateCandidateData(data);
    
    this.candidate_id = data.candidate_id;
    this.name = data.name;
    this.party = data.party;
    this.votes = data.votes || 0;
  }

  validateCandidateData(data) {
    if (!data.candidate_id && data.candidate_id !== 0) {
      throw new Error('Candidate ID is required');
    }
    
    if (typeof data.candidate_id !== 'number') {
      throw new Error('Candidate ID must be a number');
    }
    
    if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
      throw new Error('Name is required and must be a non-empty string');
    }
    
    if (!data.party || typeof data.party !== 'string' || data.party.trim() === '') {
      throw new Error('Party is required and must be a non-empty string');
    }
    
    if (data.votes !== undefined && (typeof data.votes !== 'number' || data.votes < 0)) {
      throw new Error('Votes must be a non-negative number');
    }
  }

  toJSON() {
    return {
      candidate_id: this.candidate_id,
      name: this.name,
      party: this.party,
      votes: this.votes
    };
  }
}

module.exports = Candidate;