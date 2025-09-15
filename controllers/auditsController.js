const express = require('express');
const router = express.Router();
const auditService = require('../services/auditService');

// POST /api/audits/plan - Risk-Limiting Audit plan (Q20)
router.post('/plan', async (req, res) => {
  try {
    const {
      election_id,
      reported_tallies,
      risk_limit_alpha,
      audit_type,
      stratification
    } = req.body;
    
    // Validate required fields
    if (!election_id || !reported_tallies || !risk_limit_alpha || !audit_type || !stratification) {
      return res.status(400).json({
        message: 'All fields are required: election_id, reported_tallies, risk_limit_alpha, audit_type, stratification'
      });
    }
    
    // Validate reported_tallies structure
    if (!Array.isArray(reported_tallies) || reported_tallies.length === 0) {
      return res.status(400).json({
        message: 'reported_tallies must be a non-empty array'
      });
    }
    
    // Validate risk_limit_alpha
    if (risk_limit_alpha <= 0 || risk_limit_alpha >= 1) {
      return res.status(400).json({
        message: 'risk_limit_alpha must be between 0 and 1'
      });
    }
    
    // Validate audit_type
    if (!['ballot_polling', 'ballot_comparison', 'bayesian'].includes(audit_type)) {
      return res.status(400).json({
        message: 'audit_type must be one of: ballot_polling, ballot_comparison, bayesian'
      });
    }
    
    const auditPlan = auditService.createRiskLimitingAuditPlan({
      election_id,
      reported_tallies,
      risk_limit_alpha,
      audit_type,
      stratification
    });
    
    // Return status 240 Audited with exact format from the image
    res.status(240).json({
      audit_id: auditPlan.audit_id,
      initial_sample_size: auditPlan.initial_sample_size,
      sampling_plan: auditPlan.sampling_plan,
      test: auditPlan.test,
      status: auditPlan.status
    });
  } catch (error) {
    if (error.message.includes('insufficient tallies')) {
      res.status(422).json({
        message: error.message
      });
    } else if (error.message.includes('invalid stratification')) {
      res.status(400).json({
        message: error.message
      });
    } else {
      res.status(500).json({
        message: error.message
      });
    }
  }
});

// GET /api/audits/:audit_id - Get audit status
router.get('/:audit_id', async (req, res) => {
  try {
    const { audit_id } = req.params;
    
    const audit = auditService.getAuditStatus(audit_id);
    res.status(200).json(audit);
  } catch (error) {
    if (error.message.includes('not found')) {
      res.status(404).json({
        message: error.message
      });
    } else {
      res.status(500).json({
        message: error.message
      });
    }
  }
});

// POST /api/audits/:audit_id/sample - Submit sample results
router.post('/:audit_id/sample', async (req, res) => {
  try {
    const { audit_id } = req.params;
    const { sample_results } = req.body;
    
    if (!sample_results || !Array.isArray(sample_results)) {
      return res.status(400).json({
        message: 'sample_results array is required'
      });
    }
    
    const updatedAudit = auditService.submitSampleResults(audit_id, sample_results);
    res.status(200).json(updatedAudit);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

module.exports = router;