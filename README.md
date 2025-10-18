# SUST Prompt Storm - Voting & Analytics API

> **Hackathon Challenge**: This project addresses the HackTheAI Preliminary Challenge. For complete problem statement details, see [`HackTheAI-Preli-Problems.html`](./HackTheAI-Preli-Problems.html)

Modern backend API for an election/voting system with real-time tallying, analytics, and integrity features. Built for rapid prototyping with in-memory storage.

**Server**: http://localhost:8000

---

## 🎯 Problem Overview

The challenge focuses on building a comprehensive election/voting platform with:
- Multiple ballot types (plurality, ranked-choice, weighted)
- Real-time result aggregation and analytics
- Voter/candidate management with validation rules
- Future-ready architecture for cryptographic verification and audit trails

---

## ✨ Key Features

### Core Platform
- ⚡ Express.js with layered architecture (controllers → services → models)
- 👥 Users & Projects CRUD
- 🧠 In-memory store (production DB-ready)

### Election System
- 🗳️ Voter registration (age ≥18 validation) & candidate management
- ✅ Vote casting with single-vote enforcement
- 📊 Real-time results aggregation
- 📈 Analytics ready for differential privacy
- 🔍 Audit event scaffolding

### Roadmap
- 🔐 Ranked-choice & weighted ballots
- 🧾 Encrypted ballots + zero-knowledge proofs
- 🔏 Differential privacy analytics
- 🛡️ Risk-limiting audits & blockchain anchoring

---

## 🚀 Quick Start

```bash
npm install
npm run dev   # development with nodemon
# or npm start (production)
```

**Docker**:
```bash
docker compose up -d --build
curl http://localhost:8000
```

---

## 📚 API Endpoints

| Domain | Endpoint | Description |
|--------|----------|-------------|
| **Users** | `/api/users` | Participant registry |
| **Projects** | `/api/projects` | Project lifecycle management |
| **Voters** | `/api/voters` | Voter registration (age ≥18) |
| **Candidates** | `/api/candidates` | Candidate roster |
| **Votes** | `/api/votes` | Cast plurality votes |
| **Results** | `/api/results` | Aggregated tallies |
| **Analytics** | `/api/analytics` | Turnout & DP aggregates *(planned)* |
| **Audits** | `/api/audits` | Event logs *(planned)* |

### Example Usage

```bash
# Register voter
curl -X POST http://localhost:8000/api/voters \
  -H 'Content-Type: application/json' \
  -d '{"voter_id":1,"name":"Alice","age":22}'

# Cast vote
curl -X POST http://localhost:8000/api/votes \
  -d '{"voter_id":1,"candidate_id":2}'

# View results
curl http://localhost:8000/api/results
```

---

## 🗺️ Development Roadmap

| Phase | Feature | Status |
|-------|---------|--------|
| **1-3** | Core CRUD, Voters, Basic voting | ✅ Complete |
| **4** | Ranked-choice & weighted ballots | ⏳ Planned |
| **5** | Encrypted ballots + ZK proofs | ⏳ Planned |
| **6** | Differential Privacy analytics | ⏳ Planned |
| **7** | Audit logs & RLA tooling | ⏳ Planned |
| **8** | Database persistence | ⏳ Planned |

---

## 🧱 Architecture

```
HTTP Request → Controller → Service → Model → In-Memory Store
              (validation)  (logic)   (schema)  (data)
```

**Tech Stack**: Node.js, Express, UUID, Docker

**Structure**:
```
├── controllers/    # HTTP handlers
├── services/       # Business logic
├── models/         # Data schemas
├── database.js     # In-memory store
└── server.js       # App bootstrap
```

---

## 🔐 Security Features

- ✅ Voter uniqueness & single-vote enforcement
- ✅ Age validation (≥18 years)
- ✅ Deterministic validation
- 🔜 Differential privacy budget management
- 🔜 Zero-knowledge proof verification
- 🔜 Risk-limiting audit sampling
- 🔜 Hash chain + blockchain anchoring

---

## 💼 Summary

*"Modern voting API with voters, candidates, real-time tallying, and analytics. Features extensible architecture for ranked-choice voting, differential privacy, and cryptographic verification. Built on Node.js/Express with future-ready audit and integrity features."*

---

## 🤝 Contributing

PRs welcome! Focus areas: tests, advanced tally algorithms (RCV), DP framework, cryptographic primitives.

---

## 📄 License

MIT

---

**For detailed problem requirements, refer to [`HackTheAI-Preli-Problems.html`](./HackTheAI-Preli-Problems.html)**
