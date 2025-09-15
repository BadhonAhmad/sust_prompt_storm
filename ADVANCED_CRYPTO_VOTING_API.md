# Advanced Cryptographic Voting System API

## Base URL
```
http://localhost:3001
```

## Advanced API Endpoints (Q15-Q18)

### Q15 - GET: Range Vote Queries
**GET** `/api/votes/range?candidate_id={id}&from={t1}&to={t2}`

Get votes for a candidate within a specific time range.

**Query Parameters:**
- `candidate_id` (required): ID of the candidate
- `from` (required): Start timestamp (ISO 8601 format)
- `to` (required): End timestamp (ISO 8601 format)

**Success Response (235 Range):**
```json
{
  "candidate_id": 2,
  "from": "2025-09-10T10:00:00Z",
  "to": "2025-09-10T12:00:00Z",
  "votes_gained": 42
}
```

**Error Response (424 Failed Dependency):**
```json
{
  "message": "invalid interval: from > to"
}
```

---

### Q16 - POST: End-to-End Verifiable Encrypted Ballot
**POST** `/api/ballots/encrypted`

Accept encrypted ballots with zero-knowledge proofs and nullifiers to prevent double voting.

**Request Body:**
```json
{
  "election_id": "nat-2025",
  "ciphertext": "base64(Paillier_or_ElGamal_cipher)",
  "zk_proof": "base64(Groth16_or_Plonk_proof)",
  "voter_pubkey": "hex(P-256)",
  "nullifier": "hex(keccak256(signal))",
  "signature": "base64(Ed25519 signature over payload)"
}
```

**Success Response (236 Encrypted):**
```json
{
  "ballot_id": "b_7f8c",
  "status": "accepted",
  "nullifier": "0x4a1e...",
  "anchored_at": "2025-09-15T08:30:00Z"
}
```

**Error Response (425 Too Early):**
```json
{
  "message": "invalid zk proof"
}
```

---

### Q17 - POST: Homomorphic Tally With Verifiable Decryption
**POST** `/api/results/homomorphic`

Tally encrypted ballots without decryption and publish verifiable results.

**Request Body:**
```json
{
  "election_id": "nat-2025",
  "trustee_decrypt_shares": [
    {
      "trustee_id": "T1",
      "share": "base64(...)",
      "proof": "base64(NIZK)"
    },
    {
      "trustee_id": "T3",
      "share": "base64(...)",
      "proof": "base64(NIZK)"
    },
    {
      "trustee_id": "T5",
      "share": "base64(...)",
      "proof": "base64(NIZK)"
    }
  ]
}
```

**Success Response (237 Tallied):**
```json
{
  "election_id": "nat-2025",
  "encrypted_tally_root": "0x9ab3...",
  "candidate_tallies": [
    {
      "candidate_id": 1,
      "votes": 40321
    },
    {
      "candidate_id": 2,
      "votes": 39997
    }
  ],
  "decryption_proof": "base64(batch_proof_linking_cipher_aggregate_to_plain_counts)",
  "transparency": {
    "ballot_merkle_root": "0x5d2c...",
    "tally_method": "threshold_paillier",
    "threshold": "3-of-5"
  }
}
```

---

### Q18 - POST: Differential-Privacy Analytics
**POST** `/api/analytics/dp`

Permit aggregate queries with differential privacy noise and budget tracking.

**Request Body:**
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

**Success Response (238 Private):**
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

---

## Additional Endpoints

### GET: Privacy Budget Status
**GET** `/api/analytics/budget?election_id={id}`

**Response:**
```json
{
  "election_id": "nat-2025",
  "total_budget": 10.0,
  "used_budget": 0.5,
  "remaining_budget": 9.5
}
```

### GET: Encrypted Ballots
**GET** `/api/ballots/encrypted?election_id={id}`

**Response:**
```json
{
  "ballots": [
    {
      "ballot_id": "b_7f8c",
      "election_id": "nat-2025",
      "status": "accepted",
      "anchored_at": "2025-09-15T08:30:00Z"
    }
  ],
  "count": 1
}
```

---

## Sample Test Data

### Range Vote Query:
```
GET /api/votes/range?candidate_id=1&from=2025-09-15T00:00:00Z&to=2025-09-15T23:59:59Z
```

### Encrypted Ballot:
```json
{
  "election_id": "nat-2025",
  "ciphertext": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
  "zk_proof": "MEYCIQDxGW8S5P2xP3B9P5x7Z8rV2sV9wV1Q2xV3R4sV6xV7xWxVwIhAP5x7Z8rV2sV9wV1Q2xV3R4sV6xV7xWxV",
  "voter_pubkey": "04a7b9b3c8d9e2f1a8b7c6d5e4f3a2b1c9d8e7f6a5b4c3d2e1f9a8b7c6d5e4f3",
  "nullifier": "0x4a1e7b2c9d3f8e5a6b4c7d9e2f1a8b5c3d6e9f2a7b4c1d8e5f2a9b6c3d0e7f4a1",
  "signature": "MEYCIQDxGW8S5P2xP3B9P5x7Z8rV2sV9wV1Q2xV3R4sV6xV7xWxVwIhAP5x7Z8rV2sV9wV1Q2xV3R4sV6xV7xWxV"
}
```

### Homomorphic Tally:
```json
{
  "election_id": "nat-2025",
  "trustee_decrypt_shares": [
    {
      "trustee_id": "T1",
      "share": "MEYCIQDxGW8S5P2xP3B9P5x7Z8rV2sV9wV1Q2xV3R4sV6xV7xWxVwIhAP5x7Z8rV2sV9wV1Q2xV3R4sV6xV7xWxV",
      "proof": "MEUCIQDxGW8S5P2xP3B9P5x7Z8rV2sV9wV1Q2xV3R4sV6xV7xWxVwIgP5x7Z8rV2sV9wV1Q2xV3R4sV6xV7xWxV"
    },
    {
      "trustee_id": "T3",
      "share": "MEYCIQDxGW8S5P2xP3B9P5x7Z8rV2sV9wV1Q2xV3R4sV6xV7xWxVwIhAP5x7Z8rV2sV9wV1Q2xV3R4sV6xV7xWxV",
      "proof": "MEUCIQDxGW8S5P2xP3B9P5x7Z8rV2sV9wV1Q2xV3R4sV6xV7xWxVwIgP5x7Z8rV2sV9wV1Q2xV3R4sV6xV7xWxV"
    },
    {
      "trustee_id": "T5",
      "share": "MEYCIQDxGW8S5P2xP3B9P5x7Z8rV2sV9wV1Q2xV3R4sV6xV7xWxVwIhAP5x7Z8rV2sV9wV1Q2xV3R4sV6xV7xWxV",
      "proof": "MEUCIQDxGW8S5P2xP3B9P5x7Z8rV2sV9wV1Q2xV3R4sV6xV7xWxVwIgP5x7Z8rV2sV9wV1Q2xV3R4sV6xV7xWxV"
    }
  ]
}
```

### Differential Privacy Query:
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
  "epsilon": 1.0,
  "buckets": ["18-24", "25-34", "35-44", "45-64", "65+"],
  "delta": 1e-6
}
```

---

## Cryptographic Features

### Zero-Knowledge Proofs
- Supports Groth16 and Plonk proof systems
- Validates proof correctness before ballot acceptance
- Prevents invalid votes while maintaining privacy

### Nullifier System
- Prevents double voting using cryptographic nullifiers
- Each voter can only submit one ballot per election
- Nullifiers are stored but don't reveal voter identity

### Homomorphic Encryption
- Tallies encrypted votes without decryption
- Uses threshold Paillier cryptosystem (3-of-5 trustees)
- Provides verifiable decryption proofs

### Differential Privacy
- Implements Laplace mechanism for privacy protection
- Tracks epsilon budget to prevent privacy leakage
- Supports histogram queries with configurable noise

## Error Codes

- **235**: Range query successful
- **236**: Encrypted ballot accepted
- **237**: Homomorphic tally completed
- **238**: Differential privacy query completed
- **424**: Failed dependency (invalid time range)
- **425**: Too early (invalid cryptographic proof)
- **429**: Too many requests (privacy budget exceeded)

---

## Testing Sequence

1. **Range Query**: Test vote counting in time intervals
2. **Encrypted Ballot**: Submit cryptographic ballot with proofs
3. **Homomorphic Tally**: Perform threshold decryption
4. **Privacy Analytics**: Query voter demographics with noise
5. **Budget Check**: Monitor remaining privacy budget

All endpoints are now ready for testing the advanced cryptographic voting features!