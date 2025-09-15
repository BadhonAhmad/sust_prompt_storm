// In-memory database for hackathon
const { v4: uuidv4 } = require('uuid');

class InMemoryDB {
  constructor() {
    this.users = [];
    this.projects = [];
    this.submissions = [];
    this.voters = [];
    this.candidates = [];
    this.votes = [];
    this.voteIdCounter = 101; // Starting vote ID as per specification
    this.weightedVoteIdCounter = 201; // Starting weighted vote ID as per specification
    this.encryptedBallots = [];
    this.usedNullifiers = new Set();
    this.ballotIdCounter = 0;
    
    // Initialize with some sample data
    this.initializeSampleData();
  }

  initializeSampleData() {
    // Sample users
    this.users = [
      {
        id: uuidv4(),
        name: 'John Doe',
        email: 'john@example.com',
        role: 'participant',
        team: 'Team Alpha',
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'mentor',
        team: null,
        createdAt: new Date().toISOString()
      }
    ];

    // Sample projects
    this.projects = [
      {
        id: uuidv4(),
        title: 'AI-Powered Chat Assistant',
        description: 'A smart chatbot using natural language processing',
        category: 'AI/ML',
        teamName: 'Team Alpha',
        status: 'in-progress',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // Sample voters
    this.voters = [
      {
        voter_id: 1,
        name: 'Alice Johnson',
        age: 22,
        has_voted: false
      },
      {
        voter_id: 2,
        name: 'Bob Smith',
        age: 30,
        has_voted: false
      }
    ];

    // Sample candidates
    this.candidates = [
      {
        candidate_id: 1,
        name: 'John Doe',
        party: 'Green Party',
        votes: 0
      },
      {
        candidate_id: 2,
        name: 'Jane Smith',
        party: 'Blue Party',
        votes: 0
      }
    ];

    // Sample votes (empty initially)
    this.votes = [];
  }

  // Generic CRUD operations
  findAll(collection) {
    return this[collection] || [];
  }

  findById(collection, id) {
    return this[collection].find(item => item.id === id);
  }

  create(collection, data) {
    const newItem = {
      id: uuidv4(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this[collection].push(newItem);
    return newItem;
  }

  update(collection, id, data) {
    const index = this[collection].findIndex(item => item.id === id);
    if (index === -1) return null;
    
    this[collection][index] = {
      ...this[collection][index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    return this[collection][index];
  }

  delete(collection, id) {
    const index = this[collection].findIndex(item => item.id === id);
    if (index === -1) return false;
    
    this[collection].splice(index, 1);
    return true;
  }

  // Specific query methods for voters and candidates
  findVoterById(voter_id) {
    return this.voters.find(voter => voter.voter_id === voter_id);
  }

  findCandidateById(candidate_id) {
    return this.candidates.find(candidate => candidate.candidate_id === candidate_id);
  }

  createVoter(voterData) {
    // Check if voter with this ID already exists
    const existingVoter = this.findVoterById(voterData.voter_id);
    if (existingVoter) {
      throw new Error(`voter with id: ${voterData.voter_id} already exists`);
    }
    
    this.voters.push(voterData);
    return voterData;
  }

  updateVoter(voter_id, updateData) {
    const index = this.voters.findIndex(voter => voter.voter_id === voter_id);
    if (index === -1) {
      throw new Error(`voter with id: ${voter_id} was not found`);
    }
    
    this.voters[index] = { ...this.voters[index], ...updateData };
    return this.voters[index];
  }

  deleteVoter(voter_id) {
    const index = this.voters.findIndex(voter => voter.voter_id === voter_id);
    if (index === -1) {
      throw new Error(`voter with id: ${voter_id} was not found`);
    }
    
    this.voters.splice(index, 1);
    return true;
  }

  createCandidate(candidateData) {
    // Check if candidate with this ID already exists
    const existingCandidate = this.findCandidateById(candidateData.candidate_id);
    if (existingCandidate) {
      throw new Error(`candidate with id: ${candidateData.candidate_id} already exists`);
    }
    
    this.candidates.push(candidateData);
    return candidateData;
  }

  // Voting methods
  castVote(voter_id, candidate_id) {
    // Check if voter exists
    const voter = this.findVoterById(voter_id);
    if (!voter) {
      throw new Error(`voter with id: ${voter_id} was not found`);
    }

    // Check if candidate exists
    const candidate = this.findCandidateById(candidate_id);
    if (!candidate) {
      throw new Error(`candidate with id: ${candidate_id} was not found`);
    }

    // Check if voter has already voted
    if (voter.has_voted) {
      throw new Error(`voter with id: ${voter_id} has already voted`);
    }

    // Create vote record
    const vote = {
      vote_id: this.voteIdCounter++,
      voter_id: voter_id,
      candidate_id: candidate_id,
      timestamp: new Date().toISOString()
    };

    // Add vote to votes collection
    this.votes.push(vote);

    // Mark voter as voted
    voter.has_voted = true;

    // Increment candidate vote count
    candidate.votes++;

    return vote;
  }

  // Cast a weighted vote based on voter profile
  castWeightedVote(voter_id, candidate_id) {
    // Check if voter exists
    const voter = this.findVoterById(voter_id);
    if (!voter) {
      throw new Error(`voter with id: ${voter_id} was not found`);
    }

    // Check if candidate exists
    const candidate = this.findCandidateById(candidate_id);
    if (!candidate) {
      throw new Error(`candidate with id: ${candidate_id} was not found`);
    }

    // Check if voter has already voted
    if (voter.has_voted) {
      throw new Error(`voter with id: ${voter_id} has already voted`);
    }

    // Calculate weight based on voter profile (simplified logic)
    // Weight is 2 if voter has complete profile (name and age > 25), otherwise 1
    const weight = (voter.name && voter.age > 25) ? 2 : 1;

    // Create weighted vote record
    const vote = {
      vote_id: this.weightedVoteIdCounter++,
      voter_id: voter_id,
      candidate_id: candidate_id,
      weight: weight,
      timestamp: new Date().toISOString()
    };

    // Add vote to votes collection
    this.votes.push(vote);

    // Mark voter as voted
    voter.has_voted = true;

    // Increment candidate vote count by weight
    candidate.votes += weight;

    return vote;
  }

  getCandidatesByParty(party) {
    return this.candidates.filter(candidate => 
      candidate.party.toLowerCase() === party.toLowerCase()
    );
  }

  getVotingResults() {
    // Return candidates sorted by votes in descending order
    return this.candidates
      .sort((a, b) => b.votes - a.votes)
      .map(candidate => ({
        candidate_id: candidate.candidate_id,
        name: candidate.name,
        votes: candidate.votes
      }));
  }

  getWinners() {
    // Get all candidates sorted by votes
    const sortedCandidates = this.candidates.sort((a, b) => b.votes - a.votes);
    
    if (sortedCandidates.length === 0) {
      return [];
    }
    
    // Get the highest vote count
    const maxVotes = sortedCandidates[0].votes;
    
    // Return all candidates with the highest vote count (handles ties)
    return sortedCandidates
      .filter(candidate => candidate.votes === maxVotes)
      .map(candidate => ({
        candidate_id: candidate.candidate_id,
        name: candidate.name,
        votes: candidate.votes
      }));
  }

  // Encrypted ballot methods
  isNullifierUsed(nullifier) {
    return this.usedNullifiers.has(nullifier);
  }

  createEncryptedBallot(ballotData) {
    // Generate ballot ID
    const ballot_id = `b_${(this.ballotIdCounter++).toString(16).padStart(4, '0')}`;
    
    // Create ballot record
    const ballot = {
      ballot_id: ballot_id,
      election_id: ballotData.election_id,
      ciphertext: ballotData.ciphertext,
      zk_proof: ballotData.zk_proof,
      voter_pubkey: ballotData.voter_pubkey,
      nullifier: ballotData.nullifier,
      signature: ballotData.signature,
      status: 'accepted',
      anchored_at: new Date().toISOString()
    };
    
    // Store ballot and mark nullifier as used
    this.encryptedBallots.push(ballot);
    this.usedNullifiers.add(ballotData.nullifier);
    
    return {
      ballot_id: ballot.ballot_id,
      status: ballot.status,
      nullifier: ballot.nullifier,
      anchored_at: ballot.anchored_at
    };
  }

  getEncryptedBallots(election_id) {
    if (election_id) {
      return this.encryptedBallots.filter(ballot => ballot.election_id === election_id);
    }
    return this.encryptedBallots;
  }

  // Homomorphic tally with threshold decryption
  performHomomorphicTally(tallyData) {
    const { election_id, trustee_decrypt_shares } = tallyData;
    
    // Validate minimum threshold (3-of-5)
    if (trustee_decrypt_shares.length < 3) {
      throw new Error('insufficient trustees for threshold decryption');
    }
    
    // Simulate homomorphic tally computation
    const candidateTallies = this.candidates.map(candidate => ({
      candidate_id: candidate.candidate_id,
      votes: candidate.votes + Math.floor(Math.random() * 1000) // Simulate encrypted vote aggregation
    }));
    
    // Generate cryptographic proofs (simulated)
    const encrypted_tally_root = '0x9ab3' + Math.random().toString(16).substring(2, 10);
    const ballot_merkle_root = '0x5d2c' + Math.random().toString(16).substring(2, 10);
    const decryption_proof = Buffer.from('batch_proof_linking_cipher_aggregate_to_plain_counts_' + Date.now()).toString('base64');
    
    return {
      election_id: election_id,
      encrypted_tally_root: encrypted_tally_root,
      candidate_tallies: candidateTallies,
      decryption_proof: decryption_proof,
      transparency: {
        ballot_merkle_root: ballot_merkle_root,
        tally_method: 'threshold_paillier',
        threshold: '3-of-5'
      }
    };
  }

  // Specific query methods
  findByEmail(email) {
    return this.users.find(user => user.email === email);
  }

  findProjectsByTeam(teamName) {
    return this.projects.filter(project => project.teamName === teamName);
  }

  findProjectsByCategory(category) {
    return this.projects.filter(project => project.category === category);
  }

  // Statistics
  getStats() {
    return {
      totalUsers: this.users.length,
      totalProjects: this.projects.length,
      totalSubmissions: this.submissions.length,
      totalVoters: this.voters.length,
      totalCandidates: this.candidates.length,
      totalVotes: this.votes.length,
      projectsByCategory: this.getProjectsByCategory(),
      usersByRole: this.getUsersByRole()
    };
  }

  getProjectsByCategory() {
    const categories = {};
    this.projects.forEach(project => {
      categories[project.category] = (categories[project.category] || 0) + 1;
    });
    return categories;
  }

  getUsersByRole() {
    const roles = {};
    this.users.forEach(user => {
      roles[user.role] = (roles[user.role] || 0) + 1;
    });
    return roles;
  }
}

// Create and export a single instance
const db = new InMemoryDB();

module.exports = db;