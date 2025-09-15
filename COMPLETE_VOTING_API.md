# Complete Voting System API Documentation

## Base URL
```
http://localhost:3001
```

## All Voting API Endpoints

### Q1 - POST: Create Voter
**POST** `/api/voters`

Register a new voter with unique ID, name, and age validation (minimum 18 years).

**Request Body:**
```json
{
  "voter_id": 1,
  "name": "Alice",
  "age": 22
}
```

**Success Response (218 Created):**
```json
{
  "voter_id": 1,
  "name": "Alice",
  "age": 22,
  "has_voted": false
}
```

---

### Q2 - GET: Get Voter Info
**GET** `/api/voters/{voter_id}`

**Success Response (222 Found):**
```json
{
  "voter_id": 1,
  "name": "Alice",
  "age": 22,
  "has_voted": false
}
```

---

### Q3 - GET: List All Voters
**GET** `/api/voters`

**Success Response (223 Listed):**
```json
{
  "voters": [
    {
      "voter_id": 1,
      "name": "Alice",
      "age": 22
    },
    {
      "voter_id": 2,
      "name": "Bob",
      "age": 30
    }
  ]
}
```

---

### Q4 - PUT: Update Voter Info
**PUT** `/api/voters/{voter_id}`

**Request Body:**
```json
{
  "name": "Alice Smith",
  "age": 25
}
```

**Success Response (224 Updated):**
```json
{
  "voter_id": 1,
  "name": "Alice Smith",
  "age": 25,
  "has_voted": false
}
```

---

### Q5 - DELETE: Delete Voter
**DELETE** `/api/voters/{voter_id}`

**Success Response (225 Deleted):**
```json
{
  "message": "voter with id: 1 deleted successfully"
}
```

---

### Q6 - POST: Register Candidate
**POST** `/api/candidates`

**Request Body:**
```json
{
  "candidate_id": 1,
  "name": "John Doe",
  "party": "Green Party"
}
```

**Success Response (226 Registered):**
```json
{
  "candidate_id": 1,
  "name": "John Doe",
  "party": "Green Party",
  "votes": 0
}
```

---

### Q7 - GET: List Candidates
**GET** `/api/candidates`

**Success Response (227 Listed):**
```json
{
  "candidates": [
    {
      "candidate_id": 1,
      "name": "John Doe",
      "party": "Green Party"
    },
    {
      "candidate_id": 2,
      "name": "Jane Roe",
      "party": "Red Party"
    }
  ]
}
```

---

### Q8 - POST: Cast Vote
**POST** `/api/votes`

**Request Body:**
```json
{
  "voter_id": 1,
  "candidate_id": 2
}
```

**Success Response (228 Voted):**
```json
{
  "vote_id": 101,
  "voter_id": 1,
  "candidate_id": 2,
  "timestamp": "2025-09-10T10:30:00Z"
}
```

**Error Response (423 Locked):**
```json
{
  "message": "voter with id: 1 has already voted"
}
```

---

### Q9 - GET: Get Candidate Votes
**GET** `/api/candidates/{candidate_id}/votes`

**Success Response (229 Counted):**
```json
{
  "candidate_id": 2,
  "votes": 45
}
```

---

### Q10 - GET: Filter Candidates by Party
**GET** `/api/candidates?party={party_name}`

**Success Response (230 Filtered):**
```json
{
  "candidates": [
    {
      "candidate_id": 1,
      "name": "John Doe",
      "party": "Green Party"
    }
  ]
}
```

---

### Q11 - GET: Voting Results (Leaderboard)
**GET** `/api/results`

**Success Response (231 Results):**
```json
{
  "results": [
    {
      "candidate_id": 2,
      "name": "Jane Roe",
      "votes": 45
    },
    {
      "candidate_id": 1,
      "name": "John Doe",
      "votes": 30
    }
  ]
}
```

---

### Q12 - GET: Winning Candidate
**GET** `/api/results/winner`

Get the winning candidate(s), handling ties appropriately.

**Success Response (232 Winner):**
```json
{
  "winners": [
    {
      "candidate_id": 1,
      "name": "John Doe",
      "votes": 40
    },
    {
      "candidate_id": 2,
      "name": "Jane Roe",
      "votes": 40
    }
  ]
}
```

---

### Q13 - GET: Vote Timeline
**GET** `/api/votes/timeline?candidate_id={id}`

Get the timeline of votes for a specific candidate.

**Success Response (233 Timeline):**
```json
{
  "candidate_id": 2,
  "timeline": [
    {
      "vote_id": 101,
      "timestamp": "2025-09-10T10:30:00Z"
    },
    {
      "vote_id": 102,
      "timestamp": "2025-09-10T10:32:00Z"
    }
  ]
}
```

---

### Q14 - POST: Conditional Vote Weight
**POST** `/api/votes/weighted`

Cast a weighted vote based on voter profile update status.

**Request Body:**
```json
{
  "voter_id": 1,
  "candidate_id": 2
}
```

**Success Response (234 Weighted):**
```json
{
  "vote_id": 201,
  "voter_id": 1,
  "candidate_id": 2,
  "weight": 2,
  "timestamp": "2025-09-10T10:30:00Z"
}
```

---

## Postman Testing Collection

### Sample Test Data for All Endpoints:

**Create Voters:**
```json
{
  "voter_id": 3,
  "name": "Charlie Brown",
  "age": 28
}
```

**Register Candidates:**
```json
{
  "candidate_id": 3,
  "name": "Mike Wilson",
  "party": "Blue Party"
}
```

**Cast Regular Vote:**
```json
{
  "voter_id": 1,
  "candidate_id": 2
}
```

**Cast Weighted Vote:**
```json
{
  "voter_id": 2,
  "candidate_id": 1
}
```

### Complete Test Sequence:

1. **Server Info**: GET `http://localhost:3001/`
2. **List Voters**: GET `http://localhost:3001/api/voters`
3. **Create Voter**: POST `http://localhost:3001/api/voters`
4. **List Candidates**: GET `http://localhost:3001/api/candidates`
5. **Register Candidate**: POST `http://localhost:3001/api/candidates`
6. **Filter by Party**: GET `http://localhost:3001/api/candidates?party=Green Party`
7. **Cast Vote**: POST `http://localhost:3001/api/votes`
8. **Cast Weighted Vote**: POST `http://localhost:3001/api/votes/weighted`
9. **Get Candidate Votes**: GET `http://localhost:3001/api/candidates/1/votes`
10. **Vote Timeline**: GET `http://localhost:3001/api/votes/timeline?candidate_id=1`
11. **Voting Results**: GET `http://localhost:3001/api/results`
12. **Get Winner**: GET `http://localhost:3001/api/results/winner`

---

## Weighted Vote Logic

The weighted vote system works as follows:
- **Weight = 2**: If voter has complete profile (name exists and age > 25)
- **Weight = 1**: Default weight for all other voters

## Error Handling

All endpoints implement proper error handling with the specified HTTP status codes:
- **218-234**: Success responses as specified
- **400**: Bad Request (validation errors)
- **404**: Not Found (resource doesn't exist)
- **409**: Conflict (duplicate resource)
- **417**: Expectation Failed (resource not found)
- **422**: Unprocessable Entity (invalid age)
- **423**: Locked (already voted)
- **500**: Internal Server Error