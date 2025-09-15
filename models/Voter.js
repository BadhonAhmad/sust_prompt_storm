// Voter model for validation and structure
class Voter {
  constructor(data) {
    this.validateVoterData(data);
    
    this.voter_id = data.voter_id;
    this.name = data.name;
    this.age = data.age;
    this.has_voted = data.has_voted || false;
  }

  validateVoterData(data) {
    if (!data.voter_id && data.voter_id !== 0) {
      throw new Error('Voter ID is required');
    }
    
    if (typeof data.voter_id !== 'number') {
      throw new Error('Voter ID must be a number');
    }
    
    if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
      throw new Error('Name is required and must be a non-empty string');
    }
    
    if (!data.age && data.age !== 0) {
      throw new Error('Age is required');
    }
    
    if (typeof data.age !== 'number' || data.age < 0) {
      throw new Error('Age must be a valid number');
    }
    
    if (data.age < 18) {
      throw new Error(`invalid age: ${data.age}, must be 18 or older`);
    }
  }

  toJSON() {
    return {
      voter_id: this.voter_id,
      name: this.name,
      age: this.age,
      has_voted: this.has_voted
    };
  }

  // For listing response (without has_voted field)
  toListJSON() {
    return {
      voter_id: this.voter_id,
      name: this.name,
      age: this.age
    };
  }
}

module.exports = Voter;