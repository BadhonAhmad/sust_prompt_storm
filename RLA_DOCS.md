# Q20 - Risk-Limiting Audit (RLA) API

## Create RLA Plan
**POST** `/api/audits/plan`

Produce ballot-polling audit plan with Kaplan-Markov sequential test.

### Request Body (from your image)
```json
{
  "election_id": "nat-2025",
  "reported_tallies": [
    { "candidate_id": 1, "votes": 40321 },
    { "candidate_id": 2, "votes": 39997 }
  ],
  "risk_limit_alpha": 0.05,
  "audit_type": "ballot_polling",
  "stratification": { "counties": ["A", "B", "C"] }
}
```

### Success Response (Status 240 Audited)
```json
{
  "audit_id": "rla_8881",
  "initial_sample_size": 1200,
  "sampling_plan": "based(csv of county proportions and random seeds)",
  "test": "kaplan-markov",
  "status": "planned"
}
```

### Field Explanations:
- **election_id**: Unique identifier for the election being audited
- **reported_tallies**: Official vote counts for each candidate
- **risk_limit_alpha**: Statistical confidence level (e.g., 0.05 = 95% confidence)
- **audit_type**: Type of RLA (ballot_polling, ballot_comparison, bayesian)
- **stratification**: How to divide audit across geographic units

## Additional Endpoints

### Get Audit Status
**GET** `/api/audits/:audit_id`

```json
{
  "audit_id": "rla_8881",
  "election_id": "nat-2025",
  "status": "planned",
  "initial_sample_size": 1200,
  "sampling_plan": "based(csv of county proportions and random seeds)",
  "test": "kaplan-markov",
  "risk_limit_alpha": 0.05,
  "created_at": "2025-09-15T08:30:00Z"
}
```

### Submit Sample Results
**POST** `/api/audits/:audit_id/sample`

```json
{
  "sample_results": [
    {
      "ballot_id": "ballot_001",
      "candidate_votes": { "1": 1, "2": 0 }
    },
    {
      "ballot_id": "ballot_002", 
      "candidate_votes": { "1": 0, "2": 1 }
    }
  ]
}
```

## How Risk-Limiting Audits Work

### 1. **Statistical Foundation:**
- Uses sequential hypothesis testing
- Provides mathematically proven confidence bounds
- Stops early if evidence is strong enough

### 2. **Audit Types:**
- **ballot_polling**: Hand-count sampled ballots, compare to reported results
- **ballot_comparison**: Compare paper ballots to electronic records
- **bayesian**: Use Bayesian sequential testing methods

### 3. **Kaplan-Markov Test:**
- Sequential probability ratio test
- Accumulates evidence with each ballot
- Stops when confidence threshold reached

### 4. **Sample Size Calculation:**
- Based on victory margin and risk limit
- Closer elections require larger samples
- Formula: `n ≥ -log(α) / (2 * margin²)`

### 5. **Stratification Benefits:**
- Proportional allocation across counties
- Reduces sampling variance
- Improves efficiency

## Key Features:

1. **Risk Limiting**: Guarantees specified confidence level
2. **Sequential Testing**: Can stop early with strong evidence
3. **Efficient Sampling**: Optimized sample sizes based on margin
4. **Geographic Stratification**: Proper allocation across jurisdictions
5. **Multiple Test Methods**: Support for different statistical approaches

## Test Sequence:
1. Create audit plan with reported tallies
2. Verify Status 240 "Audited" response
3. Get initial sample size and plan
4. Submit sample results as ballots are audited
5. Monitor completion status and p-values

## Statistical Guarantees:
- **α = 0.05**: 95% confidence that incorrect outcomes are detected
- **Sequential**: Efficient early stopping when evidence is clear
- **Margin-dependent**: Sample size scales with election closeness

This implements the gold standard for election auditing with mathematical guarantees!