# Voting System API Documentation

## Base URL
```
http://localhost:8000
```

## Voting API Endpoints

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

**Error Response (409 Conflict):**
```json
{
  "message": "voter with id: 1 already exists"
}
```

**Error Response (422 Unprocessable Entity):**
```json
{
  "message": "invalid age: 16, must be 18 or older"
}
```

---

### Q2 - GET: Get Voter Info
**GET** `/api/voters/{voter_id}`

Retrieve detailed information about a specific voter by ID.

**Success Response (222 Found):**
```json
{
  "voter_id": 1,
  "name": "Alice",
  "age": 22,
  "has_voted": false
}
```

**Error Response (417 Expectation Failed):**
```json
{
  "message": "voter with id: 5 was not found"
}
```

---

### Q3 - GET: List All Voters
**GET** `/api/voters`

Retrieve a complete list of all registered voters.

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

Update existing voter information with age validation (minimum 18 years).

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

**Error Response (422 Unprocessable Entity):**
```json
{
  "message": "invalid age: 16, must be 18 or older"
}
```

---

### Q5 - DELETE: Delete Voter
**DELETE** `/api/voters/{voter_id}`

Remove a voter from the system.

**Success Response (225 Deleted):**
```json
{
  "message": "voter with id: 1 deleted successfully"
}
```

**Error Response (417 Expectation Failed):**
```json
{
  "message": "voter with id: 5 was not found"
}
```

---

### Q6 - POST: Register Candidate
**POST** `/api/candidates`

Register a new candidate for the election.

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

**Error Response (409 Conflict):**
```json
{
  "message": "candidate with id: 1 already exists"
}
```

---

## Additional Candidate Endpoints

### GET: List All Candidates
**GET** `/api/candidates`

**Success Response (200 OK):**
```json
{
  "candidates": [
    {
      "candidate_id": 1,
      "name": "John Doe",
      "party": "Green Party",
      "votes": 0
    },
    {
      "candidate_id": 2,
      "name": "Jane Smith",
      "party": "Blue Party",
      "votes": 0
    }
  ]
}
```

### GET: Get Candidate by ID
**GET** `/api/candidates/{candidate_id}`

**Success Response (200 OK):**
```json
{
  "candidate_id": 1,
  "name": "John Doe",
  "party": "Green Party",
  "votes": 0
}
```

---

## Sample Test Data

The system comes pre-loaded with the following data:

**Sample Voters:**
```json
[
  {
    "voter_id": 1,
    "name": "Alice Johnson",
    "age": 22,
    "has_voted": false
  },
  {
    "voter_id": 2,
    "name": "Bob Smith",
    "age": 30,
    "has_voted": false
  }
]
```

**Sample Candidates:**
```json
[
  {
    "candidate_id": 1,
    "name": "John Doe",
    "party": "Green Party",
    "votes": 0
  },
  {
    "candidate_id": 2,
    "name": "Jane Smith",
    "party": "Blue Party",
    "votes": 0
  }
]
```

---

## Postman Testing Collection

### Test Sequence:

1. **Test Server**: GET `http://localhost:8000/`
2. **List Voters**: GET `http://localhost:8000/api/voters`
3. **Get Voter**: GET `http://localhost:8000/api/voters/1`
4. **Create Voter**: POST `http://localhost:8000/api/voters`
5. **Update Voter**: PUT `http://localhost:8000/api/voters/1`
6. **List Candidates**: GET `http://localhost:8000/api/candidates`
7. **Register Candidate**: POST `http://localhost:8000/api/candidates`
8. **Delete Voter**: DELETE `http://localhost:8000/api/voters/3`

### Sample JSON for Testing:

**Create New Voter:**
```json
{
  "voter_id": 3,
  "name": "Charlie Brown",
  "age": 25
}
```

**Update Voter:**
```json
{
  "name": "Alice Johnson Updated",
  "age": 23
}
```

**Register New Candidate:**
```json
{
  "candidate_id": 3,
  "name": "Mike Wilson",
  "party": "Red Party"
}
```

**Test Invalid Age (should return 422):**
```json
{
  "voter_id": 4,
  "name": "Young Person",
  "age": 16
}
```

**Test Duplicate Voter (should return 409):**
```json
{
  "voter_id": 1,
  "name": "Duplicate",
  "age": 20
}
```

---

## Error Handling

The API implements proper error handling with specific HTTP status codes as requested:

- **218 Created** - Voter created successfully
- **222 Found** - Voter found successfully
- **223 Listed** - Voters listed successfully
- **224 Updated** - Voter updated successfully
- **225 Deleted** - Voter deleted successfully
- **226 Registered** - Candidate registered successfully
- **409 Conflict** - Resource already exists
- **417 Expectation Failed** - Resource not found
- **422 Unprocessable Entity** - Invalid age validation

All error responses follow the format:
```json
{
  "message": "Error description"
}
```