const db = require('../database');
const Voter = require('../models/Voter');

class VoterService {
  // Create new voter
  createVoter(voterData) {
    try {
      // Validate voter data using model
      const voterModel = new Voter(voterData);
      
      // Create voter in database
      const newVoter = db.createVoter(voterModel.toJSON());
      return newVoter;
    } catch (error) {
      throw error;
    }
  }

  // Get voter by ID
  getVoterById(voter_id) {
    const voter = db.findVoterById(voter_id);
    if (!voter) {
      throw new Error(`voter with id: ${voter_id} was not found`);
    }
    return voter;
  }

  // Get all voters
  getAllVoters() {
    return db.voters.map(voter => {
      return {
        voter_id: voter.voter_id,
        name: voter.name,
        age: voter.age
      };
    });
  }

  // Update voter
  updateVoter(voter_id, updateData) {
    try {
      // Check if voter exists
      const existingVoter = this.getVoterById(voter_id);
      
      // Validate the updated data
      const updatedVoterData = { ...existingVoter, ...updateData };
      const voterModel = new Voter(updatedVoterData);
      
      // Update in database
      const updatedVoter = db.updateVoter(voter_id, voterModel.toJSON());
      return updatedVoter;
    } catch (error) {
      throw error;
    }
  }

  // Delete voter
  deleteVoter(voter_id) {
    try {
      // Check if voter exists first
      this.getVoterById(voter_id);
      
      // Delete from database
      db.deleteVoter(voter_id);
      return { message: `voter with id: ${voter_id} deleted successfully` };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new VoterService();