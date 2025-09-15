const db = require('../database');

class AnalyticsService {
  constructor() {
    // Privacy budget tracking (epsilon budget per election)
    this.privacyBudgets = new Map();
    this.maxBudget = 10.0; // Maximum epsilon budget per election
  }
  
  // Perform differential privacy query
  performDifferentialPrivacyQuery(queryData) {
    const { election_id, query, epsilon, buckets, delta } = queryData;
    
    // Check privacy budget
    this.checkPrivacyBudget(election_id, epsilon);
    
    // Get raw data
    const rawData = this.getRawData(election_id, query);
    
    // Apply differential privacy noise
    const noisyResults = this.addDifferentialPrivacyNoise(rawData, buckets, epsilon, delta);
    
    // Consume privacy budget
    this.consumePrivacyBudget(election_id, epsilon);
    
    return {
      election_id: election_id,
      query_type: query.type,
      dimension: query.dimension,
      epsilon_used: epsilon,
      delta: delta,
      results: noisyResults,
      privacy_budget_remaining: this.getRemainingBudget(election_id),
      timestamp: new Date().toISOString()
    };
  }
  
  // Check if enough privacy budget remains
  checkPrivacyBudget(election_id, epsilon) {
    const remaining = this.getRemainingBudget(election_id);
    if (remaining < epsilon) {
      throw new Error('privacy budget exceeded');
    }
  }
  
  // Get remaining privacy budget
  getRemainingBudget(election_id) {
    const used = this.privacyBudgets.get(election_id) || 0;
    return Math.max(0, this.maxBudget - used);
  }
  
  // Consume privacy budget
  consumePrivacyBudget(election_id, epsilon) {
    const currentUsed = this.privacyBudgets.get(election_id) || 0;
    this.privacyBudgets.set(election_id, currentUsed + epsilon);
  }
  
  // Get raw data for query
  getRawData(election_id, query) {
    // Simulate getting voter data based on query
    const voters = db.voters.filter(voter => {
      if (query.filter && query.filter.has_voted !== undefined) {
        return voter.has_voted === query.filter.has_voted;
      }
      return true;
    });
    
    if (voters.length < 10) {
      throw new Error('insufficient data for privacy-preserving analysis');
    }
    
    return voters;
  }
  
  // Add differential privacy noise using Laplace mechanism
  addDifferentialPrivacyNoise(rawData, buckets, epsilon, delta) {
    const histogram = {};
    
    // Initialize buckets
    buckets.forEach(bucket => {
      histogram[bucket] = 0;
    });
    
    // Count real data into buckets
    rawData.forEach(voter => {
      const bucket = this.categorizeVoter(voter);
      if (histogram.hasOwnProperty(bucket)) {
        histogram[bucket]++;
      }
    });
    
    // Add Laplace noise for differential privacy
    const sensitivity = 1; // Maximum change one individual can make
    const scale = sensitivity / epsilon;
    
    Object.keys(histogram).forEach(bucket => {
      const noise = this.sampleLaplace(0, scale);
      histogram[bucket] = Math.max(0, Math.round(histogram[bucket] + noise));
    });
    
    return histogram;
  }
  
  // Categorize voter into age bucket
  categorizeVoter(voter) {
    const age = voter.age;
    if (age >= 18 && age <= 24) return "18-24";
    if (age >= 25 && age <= 34) return "25-34";
    if (age >= 35 && age <= 44) return "35-44";
    if (age >= 45 && age <= 64) return "45-64";
    if (age >= 65) return "65+";
    return "unknown";
  }
  
  // Sample from Laplace distribution (simplified)
  sampleLaplace(mu, b) {
    const u = Math.random() - 0.5;
    return mu - b * Math.sign(u) * Math.log(1 - 2 * Math.abs(u));
  }
  
  // Get privacy budget info
  getPrivacyBudget(election_id) {
    return {
      election_id: election_id,
      total_budget: this.maxBudget,
      used_budget: this.privacyBudgets.get(election_id) || 0,
      remaining_budget: this.getRemainingBudget(election_id)
    };
  }
}

module.exports = new AnalyticsService();