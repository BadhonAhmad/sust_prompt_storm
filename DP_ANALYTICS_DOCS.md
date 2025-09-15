# Q18 - Differential-Privacy Analytics API Testing

## Endpoint
```
POST /api/analytics/dp
```

## Request Body (from your image)
```json
{
  "election_id": "nat-2025",
  "query": {
    "type": "histogram",
    "dimension": "voter_age_bucket",
    "filter": {
      "has_voted": true
    }
  },
  "epsilon": 0.5,
  "buckets": ["18-24", "25-34", "35-44", "45-64", "65+"],
  "delta": 1e-6
}
```

## Expected Success Response (Status 238 Private)
```json
{
  "election_id": "nat-2025",
  "query_type": "histogram",
  "dimension": "voter_age_bucket",
  "epsilon_used": 0.5,
  "delta": 1e-6,
  "results": {
    "18-24": 12,
    "25-34": 18,
    "35-44": 15,
    "45-64": 22,
    "65+": 8
  },
  "privacy_budget_remaining": 9.5,
  "timestamp": "2025-09-15T08:30:00Z"
}
```

## Additional Test: Check Privacy Budget
```
GET /api/analytics/budget?election_id=nat-2025
```

**Response:**
```json
{
  "election_id": "nat-2025",
  "total_budget": 10.0,
  "used_budget": 0.5,
  "remaining_budget": 9.5
}
```

## What This API Does

### Differential Privacy Features:
1. **Laplace Noise**: Adds mathematical noise to protect individual privacy
2. **Epsilon Budget**: Tracks cumulative privacy loss (max 10.0 per election)
3. **Delta Parameter**: Controls probability of privacy breach
4. **Histogram Queries**: Generates age distribution with privacy protection

### Privacy Protection:
- Results are noisy versions of true counts
- No individual voter can be identified
- Budget prevents excessive querying
- Mathematically proven privacy guarantees

### Error Responses:
- **Status 429**: Privacy budget exceeded
- **Status 422**: Insufficient data for privacy protection
- **Status 400**: Invalid query parameters

## Test Sequence:
1. Submit differential privacy query
2. Verify Status 238 "Private" response
3. Check privacy budget consumption
4. Try another query to see budget decrease
5. Exceed budget to test 429 error response

The API is ready for testing the advanced differential privacy analytics feature!