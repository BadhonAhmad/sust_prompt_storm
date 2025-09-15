# SUST Prompt Storm API Documentation

## Base URL
```
http://localhost:3000
```

## API Endpoints

### 1. Root Endpoint
**GET** `/`
- Returns API information and available endpoints

**Response:**
```json
{
  "message": "Welcome to SUST Prompt Storm API!",
  "version": "1.0.0",
  "endpoints": {
    "users": "/api/users",
    "projects": "/api/projects"
  }
}
```

---

## User Endpoints

### 2. Get All Users
**GET** `/api/users`

**Query Parameters (optional):**
- `role` - Filter by user role (participant, mentor, judge, organizer)
- `team` - Filter by team name

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-here",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "participant",
      "team": "Team Alpha",
      "skills": [],
      "bio": "",
      "createdAt": "2025-09-15T10:00:00.000Z",
      "updatedAt": "2025-09-15T10:00:00.000Z"
    }
  ],
  "count": 1
}
```

### 3. Get User by ID
**GET** `/api/users/{id}`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "participant",
    "team": "Team Alpha",
    "skills": [],
    "bio": "",
    "createdAt": "2025-09-15T10:00:00.000Z",
    "updatedAt": "2025-09-15T10:00:00.000Z"
  }
}
```

### 4. Create New User
**POST** `/api/users`

**Request Body:**
```json
{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "role": "participant",
  "team": "Team Beta",
  "skills": ["JavaScript", "React", "Node.js"],
  "bio": "Full-stack developer with 3 years experience"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "new-uuid-here",
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "role": "participant",
    "team": "Team Beta",
    "skills": ["JavaScript", "React", "Node.js"],
    "bio": "Full-stack developer with 3 years experience",
    "createdAt": "2025-09-15T10:00:00.000Z",
    "updatedAt": "2025-09-15T10:00:00.000Z"
  },
  "message": "User created successfully"
}
```

### 5. Update User
**PUT** `/api/users/{id}`

**Request Body:**
```json
{
  "name": "Alice Johnson Updated",
  "bio": "Senior full-stack developer with 3 years experience",
  "skills": ["JavaScript", "React", "Node.js", "MongoDB"]
}
```

### 6. Delete User
**DELETE** `/api/users/{id}`

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

### 7. Get User by Email
**GET** `/api/users/email/{email}`

---

## Project Endpoints

### 8. Get All Projects
**GET** `/api/projects`

**Query Parameters (optional):**
- `category` - Filter by category (AI/ML, Web Development, etc.)
- `status` - Filter by status (draft, in-progress, completed, submitted)
- `team` - Filter by team name
- `search` - Search in title and description

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-here",
      "title": "AI-Powered Chat Assistant",
      "description": "A smart chatbot using natural language processing",
      "category": "AI/ML",
      "teamName": "Team Alpha",
      "status": "in-progress",
      "technologies": [],
      "repositoryUrl": "",
      "demoUrl": "",
      "presentationUrl": "",
      "createdAt": "2025-09-15T10:00:00.000Z",
      "updatedAt": "2025-09-15T10:00:00.000Z"
    }
  ],
  "count": 1
}
```

### 9. Get Project Statistics
**GET** `/api/projects/stats`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 2,
    "totalProjects": 1,
    "totalSubmissions": 0,
    "projectsByCategory": {
      "AI/ML": 1
    },
    "usersByRole": {
      "participant": 1,
      "mentor": 1
    }
  }
}
```

### 10. Get Project by ID
**GET** `/api/projects/{id}`

### 11. Create New Project
**POST** `/api/projects`

**Request Body:**
```json
{
  "title": "Smart Home IoT System",
  "description": "An IoT system for home automation using sensors and mobile app",
  "category": "IoT",
  "teamName": "Team Beta",
  "status": "draft",
  "technologies": ["Arduino", "React Native", "Firebase"],
  "repositoryUrl": "https://github.com/team-beta/smart-home",
  "demoUrl": "https://smart-home-demo.com",
  "presentationUrl": ""
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "new-uuid-here",
    "title": "Smart Home IoT System",
    "description": "An IoT system for home automation using sensors and mobile app",
    "category": "IoT",
    "teamName": "Team Beta",
    "status": "draft",
    "technologies": ["Arduino", "React Native", "Firebase"],
    "repositoryUrl": "https://github.com/team-beta/smart-home",
    "demoUrl": "https://smart-home-demo.com",
    "presentationUrl": "",
    "createdAt": "2025-09-15T10:00:00.000Z",
    "updatedAt": "2025-09-15T10:00:00.000Z"
  },
  "message": "Project created successfully"
}
```

### 12. Update Project
**PUT** `/api/projects/{id}`

**Request Body:**
```json
{
  "title": "Advanced Smart Home IoT System",
  "description": "An advanced IoT system for complete home automation",
  "status": "in-progress",
  "technologies": ["Arduino", "React Native", "Firebase", "Machine Learning"]
}
```

### 13. Update Project Status Only
**PATCH** `/api/projects/{id}/status`

**Request Body:**
```json
{
  "status": "completed"
}
```

### 14. Delete Project
**DELETE** `/api/projects/{id}`

---

## Valid Values

### User Roles:
- `participant`
- `mentor`
- `judge`
- `organizer`

### Project Categories:
- `AI/ML`
- `Web Development`
- `Mobile Development`
- `Blockchain`
- `IoT`
- `Game Development`
- `Data Science`
- `Cybersecurity`
- `Other`

### Project Statuses:
- `draft`
- `in-progress`
- `completed`
- `submitted`

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Validation error message"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error message"
}
```

---

## Sample Test Sequence for Postman

1. **Start Server**: Run `npm start` in your project directory
2. **Test Root**: GET `http://localhost:3000/`
3. **Get Users**: GET `http://localhost:3000/api/users`
4. **Create User**: POST `http://localhost:3000/api/users` with user JSON
5. **Get Projects**: GET `http://localhost:3000/api/projects`
6. **Create Project**: POST `http://localhost:3000/api/projects` with project JSON
7. **Get Stats**: GET `http://localhost:3000/api/projects/stats`