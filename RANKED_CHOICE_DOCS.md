# Q19 - Ranked-Choice / Condorcet (Schulze) Voting API

## Submit Ranked Ballot
**POST** `/api/ballots/ranked`

Submit ranked ballots and compute Schulze winner(s) with full audit trail.

### Request Body (from your image)
```json
{
  "election_id": "city-rcv-2025",
  "voter_id": 123,
  "ranking": [3, 1, 2, 5, 4],
  "timestamp": "2025-09-10T10:15:00Z"
}
```

### Success Response (Status 239 Ranked)
```json
{
  "ballot_id": "rb_2219",
  "status": "accepted"
}
```

### Field Explanations:
- **election_id**: Unique identifier for the election
- **voter_id**: Unique identifier for the voter
- **ranking**: Array of candidate IDs in preference order (most preferred first)
- **timestamp**: When the ballot was submitted

## Get Schulze Results
**GET** `/api/results/schulze?election_id=city-rcv-2025`

Compute and return the Condorcet winner using Schulze method.

### Success Response (Status 240 Condorcet)
```json
{
  "election_id": "city-rcv-2025",
  "method": "schulze_condorcet",
  "winner": 3,
  "pairwise_matrix": {
    "1": { "2": 5, "3": 3, "4": 7, "5": 6 },
    "2": { "1": 4, "3": 2, "4": 5, "5": 4 },
    "3": { "1": 8, "2": 9, "4": 8, "5": 7 },
    "4": { "1": 2, "2": 4, "3": 1, "5": 3 },
    "5": { "1": 3, "2": 5, "3": 2, "4": 6 }
  },
  "candidate_wins": {
    "1": 2,
    "2": 1,
    "3": 4,
    "4": 0,
    "5": 1
  },
  "total_ballots": 11
}
```

## How Ranked-Choice (Schulze) Voting Works

### 1. Ballot Submission:
- Voters rank candidates in order of preference: [3, 1, 2, 5, 4]
- This means: 3 is most preferred, then 1, then 2, then 5, then 4

### 2. Pairwise Comparison:
- System compares every pair of candidates
- For each pair, counts how many voters prefer A over B
- Creates pairwise preference matrix

### 3. Schulze Method:
- Finds strongest paths between candidates
- Determines Condorcet winner (beats all others in pairwise comparisons)
- Handles cases where no pure Condorcet winner exists

### 4. Results:
- **Winner**: Candidate with most pairwise victories
- **Audit Trail**: Complete pairwise matrix and win counts
- **Transparency**: All ballot data and calculations verifiable

## Error Responses:
- **409 Conflict**: Voter has already submitted a ranked ballot
- **422 Unprocessable Entity**: Invalid ranking format
- **404 Not Found**: No ranked ballots found for election

## Test Sequence:
1. Submit multiple ranked ballots with different voter IDs
2. Verify Status 239 "Ranked" for each submission
3. Query Schulze results to see winner calculation
4. Verify pairwise matrix and candidate win counts

## Example Rankings:
```json
// Voter 123 preferences: 3 > 1 > 2 > 5 > 4
{"voter_id": 123, "ranking": [3, 1, 2, 5, 4]}

// Voter 124 preferences: 1 > 3 > 5 > 2 > 4  
{"voter_id": 124, "ranking": [1, 3, 5, 2, 4]}

// Voter 125 preferences: 2 > 3 > 1 > 4 > 5
{"voter_id": 125, "ranking": [2, 3, 1, 4, 5]}
```

This implements the mathematically rigorous Condorcet/Schulze method for finding the candidate that would win against any other candidate in head-to-head comparisons!