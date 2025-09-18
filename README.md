# SUST Prompt Storm Voting & Analytics API

Modern, extensible backend API for managing hackathon-style projects AND advanced election / voting workflows (voters, candidates, ballots, tallying, analytics, audits, and future cryptographic extensions). Runs fully in-memory (no external DB) for rapid prototyping & demonstrations.

> Port note: The server currently runs on **http://localhost:8000** (see `server.js`).

## ✨ Feature Overview

Core Platform
- ⚡ Express.js service (JSON-first, CORS enabled)
- 🧠 Layered architecture (controllers → services → models → in‑memory store)
- 👥 Users & Projects CRUD

Election / Voting Domain
- 🗳️ Voters & Candidates management
- ✅ Single-vote casting & (extensible to ranked / weighted / encrypted ballots)
- 📊 Real-time results endpoint scaffold
- 📈 Analytics endpoints (turnout, structured aggregates, DP-ready design)
- 🔍 Audit & integrity endpoints (events, future anchoring, RLA scaffolding)

Engineering & Ops
- 🧪 Clear separation of concerns for testability
- 🧩 Extensible service layer for adding tally algorithms (RCV, weighted, homomorphic)
- 🛡️ Error handling & consistent JSON envelopes

Privacy & Future Cryptography (Planned)
- 🔐 Differential Privacy (budget tracking, release control)
- 🧾 Zero-knowledge proof submission hooks
- 🔏 Signature / anchoring placeholders

## 🧱 Architecture

```
Request → Controller (validation, shape) → Service (business rules) → Model (record abstraction) → In-Memory Store
                                                   ↓
                                       (Future: persistence / cryptography / DP)
```

Layers
- Controllers: HTTP wiring & minimal validation.
- Services: Core domain logic (vote casting, uniqueness constraints, tally functions).
- Models: Simple data shape modules (placeholder for future ORM/ODM or schema).
- In-Memory Store: Fast iteration; can be swapped for MongoDB/Postgres later.

## 🚀 Quick Start

```bash
git clone <repo-url>
cd sust_prompt_storm
npm install
npm run dev   # watches with nodemon
# or
npm start     # production run
```

Server: http://localhost:8000
Root JSON index: http://localhost:8000/

## 🐳 Docker

```bash
docker compose up -d --build
curl http://localhost:8000
docker compose logs -f
```

## 📚 High-Level API Domains

| Domain | Base Path | Purpose |
|--------|-----------|---------|
| Users | `/api/users` | Hackathon participant / role registry |
| Projects | `/api/projects` | Manage project lifecycle & metadata |
| Voters | `/api/voters` | Register eligible voters (age / uniqueness rules) |
| Candidates | `/api/candidates` | Candidate roster management |
| Votes | `/api/votes` | Record direct (plurality) votes |
| Ballots | `/api/ballots` | Advanced ballot types (ranked, weighted, encrypted – roadmap) |
| Results | `/api/results` | Aggregated tallies & round data |
| Analytics | `/api/analytics` | Turnout, demographics, DP aggregates |
| Audits | `/api/audits` | Event & integrity reporting |

> For now, some endpoints are placeholders—scaffolding exists to accelerate future expansion.

## 🔑 Example Endpoints (Current & Planned)

Users
```
GET /api/users
POST /api/users
GET /api/users/:id
PUT /api/users/:id
DELETE /api/users/:id
```

Projects
```
GET /api/projects
POST /api/projects
GET /api/projects/:id
PATCH /api/projects/:id/status   # change state
DELETE /api/projects/:id
```

Voters (sample behavior reflected in HTML examples)
```
POST /api/voters            # create (age >= 18 enforced)
GET /api/voters/:id         # show (has_voted flag)
DELETE /api/voters/:id      # remove
```

Candidates
```
POST /api/candidates
GET /api/candidates
```

Votes / Ballots (plurality now; extensible)
```
POST /api/votes             # { voter_id, candidate_id }
GET  /api/results           # aggregated counts
```

Planned Advanced Voting (roadmap)
```
POST /api/ballots/ranked        # ranked-choice list
POST /api/ballots/weighted      # allocation weights
POST /api/ballots/encrypted     # ciphertext + zk proof
GET  /api/results/ranked-rounds # elimination rounds
```

Analytics & DP (planned)
```
POST /api/analytics/dp-counts   # { queries, epsilon, delta }
GET  /api/analytics/budget
```

Audits & Integrity (planned)
```
GET  /api/audits                # filterable event log
POST /api/audits/anchors        # anchor hash chain
POST /api/projects/:id/finalize # lock & finalize tally
```

## 🛡️ Security & Integrity Principles

- Deterministic validation of voter uniqueness.
- Single-vote enforcement (future: idempotency keys).
- Consistent structured error responses.
- Separation of read vs. write endpoints (ease scaling).
- Future hooks for: signatures, zero-knowledge proofs, risk‑limiting audits.

## 🔐 Differential Privacy (Roadmap)

Will support:
- Global privacy budget (epsilon, delta) per project.
- Composition strategies (basic / advanced / moments accountant).
- Noisy count & histogram release endpoints.
- Refusal of queries once budget exhausted.

## 📏 Auditing & RLA (Roadmap)

Planned capabilities:
- Audit event stream (vote cast, tally updated, finalize triggered).
- Hash chained log & optional external anchoring.
- Risk-limiting audit planning: sample generation, stratification, status tracking.

## 🧪 Testing (Planned Suggestions)

Add (future):
- Unit tests for services (vote casting, tally logic, age validation)
- Integration tests via supertest
- Property-based tests for tally algorithms (e.g. ranked-choice elimination validity)

## 🗺️ Roadmap Snapshot

| Phase | Focus | Status |
|-------|-------|--------|
| 1 | Core CRUD (users, projects) | ✅ Done |
| 2 | Voters, candidates, votes | ✅ Initial |
| 3 | Results aggregation | ✅ Basic |
| 4 | Ranked & weighted ballots | ⏳ Planned |
| 5 | Cryptographic / encrypted ballots | ⏳ Planned |
| 6 | Differential privacy analytics | ⏳ Planned |
| 7 | Audits & RLA tooling | ⏳ Planned |
| 8 | Production persistence (DB swap) | ⏳ Planned |

## 📂 Project Structure

```
├── controllers/        # Route handlers (HTTP layer)
├── services/           # Business logic (votes, tally, validation)
├── models/             # Data models (simple objects for now)
├── database.js         # In-memory registry/store
├── server.js           # Express bootstrap
├── compose.yml         # Docker compose service
├── Dockerfile          # Container build
└── package.json        # Scripts & dependencies
```

## 🛠️ Tech Stack

- Node.js + Express
- Body Parser / CORS
- UUID (id generation)
- Dotenv (env management)
- Docker (optional containerization)

## 🔄 Example: Create Voter & Cast Vote

```bash
curl -X POST http://localhost:8000/api/voters \
  -H 'Content-Type: application/json' \
  -d '{"voter_id":1,"name":"Alice","age":22}'

curl -X POST http://localhost:8000/api/votes \
  -H 'Content-Type: application/json' \
  -d '{"voter_id":1,"candidate_id":2}'

curl http://localhost:8000/api/results
```

## 🤝 Contributing

PRs welcome. Focus areas: tests, advanced tally algorithms, DP framework, cryptographic primitives.

## 📄 License

MIT

## 🔍 LinkedIn‑Ready Summary (Short)

“Built a modular voting & analytics API: voters, candidates, ballots, real‑time results, and a roadmap for ranked choice, differential privacy, audits & cryptographic verification — all running on a lean in‑memory Node.js/Express backend. Designed for rapid experimentation and future verifiability.”

---

Feel free to adapt the summary or request a version tailored to hiring, research, or competition recap.