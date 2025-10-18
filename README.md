# SUST Prompt Storm - Voting & Analytics API

> **Hackathon Problem**: *Building a comprehensive election/voting system with real-time tallying, analytics, and integrity features. The challenge focuses on creating extensible voting workflows supporting multiple ballot types (plurality, ranked-choice, weighted) with future-ready architecture for cryptographic verification, differential privacy, and audit trails.*

Modern backend API for hackathon projects AND advanced election workflows. Features voters, candidates, ballot casting, real-time results, analytics, and audit scaffolding. Fully in-memory for rapid prototyping.

**Server**: http://localhost:8000

---

## ✨ Features

**Core Platform**
- ⚡ Express.js + layered architecture (controllers → services → models)
- 👥 Users & Projects CRUD
- 🧠 In-memory store (swappable for DB later)

**Election Domain**
- 🗳️ Voters (age validation, uniqueness) & Candidates
- ✅ Vote casting with single-vote enforcement
- 📊 Real-time results aggregation
- 📈 Analytics (turnout, demographics, DP-ready design)
- 🔍 Audit endpoints (events, integrity hooks)

**Roadmap**
- 🔐 Ranked-choice & weighted ballots
- 🧾 Encrypted ballots + zero-knowledge proofs
- 🔏 Differential privacy analytics
- 🛡️ Risk-limiting audits & blockchain anchoring

---

## 🚀 Quick Start

```bash
npm install
npm run dev   # development with nodemon
# or
npm start     # production
```

**Docker**:
```bash
docker compose up -d --build
curl http://localhost:8000
```

---

## 📚 API Overview

| Domain | Endpoint | Description |
|--------|----------|-------------|
| **Users** | `/api/users` | Participant registry |
| **Projects** | `/api/projects` | Project lifecycle |
| **Voters** | `/api/voters` | Voter registration (age ≥18) |
| **Candidates** | `/api/candidates` | Candidate roster |
| **Votes** | `/api/votes` | Cast plurality votes |
| **Results** | `/api/results` | Aggregated tallies |
| **Analytics** | `/api/analytics` | Turnout & DP aggregates *(planned)* |
| **Audits** | `/api/audits` | Event logs & integrity *(planned)* |

---

## 🔑 Example Workflow

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

## 🗺️ Roadmap

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

## 🔐 Security & Future Extensions

- ✅ Voter uniqueness & single-vote enforcement
- ✅ Deterministic validation
- 🔜 Differential privacy budget management
- 🔜 Zero-knowledge proof verification
- 🔜 Risk-limiting audit sampling
- 🔜 Hash chain + blockchain anchoring

---

## 🤝 Contributing

PRs welcome! Focus areas: tests, advanced tally algorithms (RCV), DP framework, cryptographic primitives.

---

## 📄 License

MIT

---

## 💼 Project Summary

*"Built a modular voting API supporting voters, candidates, real-time tallying, and analytics — with extensible architecture for ranked-choice, differential privacy, and cryptographic verification. Designed for rapid prototyping on Node.js/Express with future-ready audit and integrity features."*
