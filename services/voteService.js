const db = require('../database');
const Vote = require('../models/Vote');

class VoteService {
  // Cast a vote
  castVote(voteData) {
    try {
      // Cast vote in database (this handles all validation and duplicate checking)
      const newVote = db.castVote(voteData.voter_id, voteData.candidate_id);
      return newVote;
    } catch (error) {
      throw error;
    }
  }

  // Get all votes
  getAllVotes() {
    return db.votes;
  }

  // Get votes by voter ID
  getVotesByVoter(voter_id) {
    return db.votes.filter(vote => vote.voter_id === voter_id);
  }

  // Get votes by candidate ID
  getVotesByCandidate(candidate_id) {
    return db.votes.filter(vote => vote.candidate_id === candidate_id);
  }

  // Check if voter has voted
  hasVoterVoted(voter_id) {
    const voter = db.findVoterById(voter_id);
    return voter ? voter.has_voted : false;
  }

  // Get vote timeline for a candidate
  getVoteTimelineForCandidate(candidate_id) {
    const candidateVotes = this.getVotesByCandidate(candidate_id);
    return candidateVotes
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .map(vote => ({
        vote_id: vote.vote_id,
        timestamp: vote.timestamp
      }));
  }

  // Cast a weighted vote based on voter profile
  castWeightedVote(voteData) {
    try {
      // Cast weighted vote in database
      const newVote = db.castWeightedVote(voteData.voter_id, voteData.candidate_id);
      return newVote;
    } catch (error) {
      throw error;
    }
  }

  // Get votes for candidate within time range
  getVotesInRange(candidate_id, from, to) {
    const candidateVotes = this.getVotesByCandidate(candidate_id);
    const fromDate = new Date(from);
    const toDate = new Date(to);
    
    const votesInRange = candidateVotes.filter(vote => {
      const voteDate = new Date(vote.timestamp);
      return voteDate >= fromDate && voteDate <= toDate;
    });
    
    // Calculate total weight of votes in range
    const votes_gained = votesInRange.reduce((total, vote) => {
      return total + (vote.weight || 1);
    }, 0);
    
    return { votes_gained };
  }
}

module.exports = new VoteService();