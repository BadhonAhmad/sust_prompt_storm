# SUST Prompt Storm API

A backend API for the SUST Prompt Storm Hackathon with an in-memory database.

## Features

- ✅ Express.js server with CORS support
- ✅ In-memory database (no external database required)
- ✅ User management (CRUD operations)
- ✅ Project management (CRUD operations)
- ✅ Data validation and error handling
- ✅ RESTful API design

## Installation

```bash
npm install
```

## Running the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/email/:email` - Get user by email
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

Query parameters:
- `role` - Filter users by role (participant, mentor, judge, organizer)
- `team` - Filter users by team name

### Projects

- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `GET /api/projects/stats` - Get project statistics
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `PATCH /api/projects/:id/status` - Update project status
- `DELETE /api/projects/:id` - Delete project

Query parameters:
- `category` - Filter by category (AI/ML, Web Development, etc.)
- `status` - Filter by status (draft, in-progress, completed, submitted)
- `team` - Filter by team name
- `search` - Search in title and description

## Sample Data

The database comes pre-loaded with sample users and projects for testing.

## Example Requests

### Create a User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com", 
    "role": "participant",
    "team": "Team Alpha"
  }'
```

### Create a Project
```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "AI Chat Bot",
    "description": "An intelligent chatbot using NLP",
    "category": "AI/ML",
    "teamName": "Team Alpha",
    "status": "in-progress"
  }'
```

## Project Structure

```
├── controllers/        # API route handlers
├── models/            # Data models and validation
├── services/          # Business logic
├── database.js        # In-memory database
├── server.js         # Express server setup
└── package.json      # Dependencies and scripts
```

## Technologies Used

- Node.js
- Express.js
- UUID for unique IDs
- CORS for cross-origin requests
- Body-parser for request parsing
- Dotenv for environment variables