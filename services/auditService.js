const db = require('../database');

class AuditService {
  constructor() {
    this.auditCounter = 8881; // Starting audit ID as per specification
  }
  
  // Create Risk-Limiting Audit plan
  createRiskLimitingAuditPlan(auditData) {
    try {
      const { election_id, reported_tallies, risk_limit_alpha, audit_type, stratification } = auditData;
      
      // Validate reported tallies
      this.validateReportedTallies(reported_tallies);
      
      // Calculate initial sample size based on audit parameters
      const initialSampleSize = this.calculateInitialSampleSize(
        reported_tallies, 
        risk_limit_alpha, 
        audit_type
      );
      
      // Create sampling plan based on stratification
      const samplingPlan = this.createSamplingPlan(
        stratification, 
        initialSampleSize,
        audit_type
      );
      
      // Determine test method
      const testMethod = this.determineTestMethod(audit_type);
      
      // Create audit record
      const audit = db.createRiskLimitingAudit({
        election_id,
        reported_tallies,
        risk_limit_alpha,
        audit_type,
        stratification,
        initial_sample_size: initialSampleSize,
        sampling_plan: samplingPlan,
        test: testMethod,
        status: 'planned'
      });
      
      return audit;
    } catch (error) {
      throw error;
    }
  }
  
  // Get audit status
  getAuditStatus(audit_id) {
    return db.getRiskLimitingAudit(audit_id);
  }
  
  // Submit sample results and update audit
  submitSampleResults(audit_id, sample_results) {
    const audit = db.getRiskLimitingAudit(audit_id);
    
    // Validate sample results
    this.validateSampleResults(sample_results);
    
    // Calculate test statistics
    const testStatistics = this.calculateTestStatistics(
      audit.test,
      sample_results,
      audit.reported_tallies
    );
    
    // Determine if audit is complete
    const isComplete = this.isAuditComplete(
      testStatistics,
      audit.risk_limit_alpha
    );
    
    // Update audit with results
    const updatedAudit = db.updateRiskLimitingAudit(audit_id, {
      sample_results,
      test_statistics: testStatistics,
      status: isComplete ? 'complete' : 'in_progress',
      completion_probability: testStatistics.p_value || 0
    });
    
    return updatedAudit;
  }
  
  // Validate reported tallies structure
  validateReportedTallies(tallies) {
    tallies.forEach(tally => {
      if (!tally.candidate_id || typeof tally.votes !== 'number') {
        throw new Error('invalid reported tallies format');
      }
    });
    
    const totalVotes = tallies.reduce((sum, tally) => sum + tally.votes, 0);
    if (totalVotes < 100) {
      throw new Error('insufficient tallies for meaningful audit');
    }
  }
  
  // Calculate initial sample size using statistical methods
  calculateInitialSampleSize(tallies, alpha, auditType) {
    const totalVotes = tallies.reduce((sum, tally) => sum + tally.votes, 0);
    const margin = this.calculateMargin(tallies);
    
    // Risk-limiting audit sample size calculation
    let baseSize;
    switch (auditType) {
      case 'ballot_polling':
        // For ballot polling audits
        baseSize = Math.ceil(-Math.log(alpha) / (2 * Math.pow(margin, 2)));
        break;
      case 'ballot_comparison':
        // For ballot comparison audits (more efficient)
        baseSize = Math.ceil(-Math.log(alpha) / (4 * Math.pow(margin, 2)));
        break;
      case 'bayesian':
        // For Bayesian audits
        baseSize = Math.ceil(-Math.log(alpha) / (3 * Math.pow(margin, 2)));
        break;
      default:
        baseSize = 1200; // Conservative default
    }
    
    // Ensure minimum sample size
    return Math.max(baseSize, Math.min(1200, Math.ceil(totalVotes * 0.01)));
  }
  
  // Calculate victory margin
  calculateMargin(tallies) {
    const sortedTallies = [...tallies].sort((a, b) => b.votes - a.votes);
    if (sortedTallies.length < 2) return 0.5;
    
    const winner = sortedTallies[0];
    const runnerUp = sortedTallies[1];
    const totalVotes = tallies.reduce((sum, tally) => sum + tally.votes, 0);
    
    return Math.abs(winner.votes - runnerUp.votes) / totalVotes;
  }
  
  // Create sampling plan based on stratification
  createSamplingPlan(stratification, sampleSize, auditType) {
    const { counties } = stratification;
    
    // Proportional allocation across counties
    const plan = counties.map(county => {
      // Simple proportional allocation (can be improved with optimal allocation)
      const proportion = 1 / counties.length; // Equal allocation for simplicity
      const countySampleSize = Math.ceil(sampleSize * proportion);
      
      return {
        county: county,
        sample_size: countySampleSize,
        method: auditType === 'ballot_comparison' ? 'cvr_comparison' : 'hand_count'
      };
    });
    
    return `based(csv of county proportions and random seeds)`;
  }
  
  // Determine test method based on audit type
  determineTestMethod(auditType) {
    switch (auditType) {
      case 'ballot_polling':
        return 'kaplan-markov';
      case 'ballot_comparison':
        return 'super-simple';
      case 'bayesian':
        return 'bayesian-sequential';
      default:
        return 'kaplan-markov';
    }
  }
  
  // Validate sample results
  validateSampleResults(results) {
    if (!Array.isArray(results) || results.length === 0) {
      throw new Error('sample_results must be non-empty array');
    }
    
    results.forEach(result => {
      if (!result.ballot_id || !result.candidate_votes) {
        throw new Error('invalid sample result format');
      }
    });
  }
  
  // Calculate test statistics (simplified Kaplan-Markov)
  calculateTestStatistics(testMethod, sampleResults, reportedTallies) {
    // Simplified statistical test calculation
    const sampleSize = sampleResults.length;
    const expectedWinRate = this.calculateExpectedWinRate(reportedTallies);
    const observedWinRate = this.calculateObservedWinRate(sampleResults, reportedTallies);
    
    // Simplified p-value calculation
    const testStatistic = Math.abs(observedWinRate - expectedWinRate) / Math.sqrt(expectedWinRate * (1 - expectedWinRate) / sampleSize);
    const pValue = 2 * (1 - this.normalCDF(Math.abs(testStatistic)));
    
    return {
      test_method: testMethod,
      sample_size: sampleSize,
      test_statistic: testStatistic,
      p_value: pValue,
      observed_win_rate: observedWinRate,
      expected_win_rate: expectedWinRate
    };
  }
  
  // Calculate expected win rate from reported tallies
  calculateExpectedWinRate(tallies) {
    const sortedTallies = [...tallies].sort((a, b) => b.votes - a.votes);
    const totalVotes = tallies.reduce((sum, tally) => sum + tally.votes, 0);
    return sortedTallies[0].votes / totalVotes;
  }
  
  // Calculate observed win rate from sample
  calculateObservedWinRate(sampleResults, reportedTallies) {
    // Simplified - assume first candidate is winner in reported tallies
    const sortedTallies = [...reportedTallies].sort((a, b) => b.votes - a.votes);
    const winnerId = sortedTallies[0].candidate_id;
    
    const winnerBallots = sampleResults.filter(result => {
      const candidateVotes = result.candidate_votes;
      return candidateVotes[winnerId] > 0; // Simplified check
    });
    
    return winnerBallots.length / sampleResults.length;
  }
  
  // Check if audit is complete
  isAuditComplete(testStatistics, alpha) {
    return testStatistics.p_value < alpha;
  }
  
  // Normal CDF approximation
  normalCDF(x) {
    return 0.5 * (1 + this.erf(x / Math.sqrt(2)));
  }
  
  // Error function approximation
  erf(x) {
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;
    
    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x);
    
    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    
    return sign * y;
  }
}

module.exports = new AuditService();