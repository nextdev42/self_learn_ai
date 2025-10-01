# Self Learn AI — Feature: OpenAI
Personalization

## Overview
This branch adds an AI-powered learning journey generator that refines rule-based recommendations and creates structured module sequences tailored to each learner using OpenAI.

---

## Installation

```bash
npm install
npm install openai dotenv axios
```
### Create a `.env` file:

```ini
OPENAI_API_KEY=sk-<your-key>
USE_OPENAI=true
OPENAI_MODEL=gpt-4o-mini
PORT=4000

```

### Running the Server

```bash
npm start
```
Server will run on the port specified in `.env` (default `4000`).

## API Endpoints & Tests

### 1. Questionnaire Submission

```bash


curl -X POST http://localhost:4000/api/questionnaire \
  -H "Content-Type: application/json" \
  -d '{"userId":"user123","answers":{"goal":"learn basics","level":"beginner"}}'

```
### Sample Response:

```json
{
  "success": true,
  "response": {
    "id": "99fd51f2-702b-4088-91fe-1a5034ac96d4",
    "userId": "user123",
    "answers": { "goal": "learn basics", "level": "beginner" }
  }
}

```
### 2\. Generate Learning Journey

```json
{
  "success": true,
  "journey": {
    "id": "833edd42-cd35-40ec-861e-a98006e7b0b7",
    "userId": "user123",
    "modules": [
      { "id": "m101", "title": "Intro to AI (Swahili)", "duration_minutes": 10, "level": "beginner" },
      { "id": "m102", "title": "Python Basics", "duration_minutes": 15, "level": "beginner" },
      { "id": "x_001", "title": "Introduction to Programming Concepts", "duration_minutes": 20, "difficulty": "beginner" },
      { "id": "x_002", "title": "Getting Started with Data Science", "duration_minutes": 30, "difficulty": "beginner" }
    ],
    "currentIndex": 0,
    "createdAt": "2025-10-01T12:25:08.425Z"
  }
}

```

### 3\. Log Module Progress

```json
curl -X POST http://localhost:4000/api/progress \
  -H "Content-Type: application/json" \
  -d '{"userId":"user123","moduleId":"m101","status":"completed","score":80}'

```

### Sample Response:

```json
{
  "success": true,
  "entry": {
    "userId":"user123",
    "moduleId":"m101",
    "status":"completed",
    "score":80,
    "updatedAt":"2025-10-01T14:10:39.682Z"
  },
  "earnedRewards":[
    {"id":"r001","title":"First Module Completed","criteria":{"modulesCompleted":1},"points":10,"userId":"user123","earnedAt":"2025-10-01T14:10:39.683Z"}
  ]
}

```

### 4\. Fetch User Rewards

```bash
curl http://localhost:4000/api/rewards/user123

```

### Sample Response:

```json
[
  {"userId":"user123","id":"r001","title":"First Module Completed","criteria":{"modulesCompleted":1},"points":10,"earnedAt":"2025-10-01T14:10:39.683Z"}
]

```

## Notes

* OpenAI personalization is optional and controlled via `USE_OPENAI` environment variable.

* Ensure your API key is valid in `.env`.

* Rule-based recommendations are used as fallback if OpenAI call fails.


* OpenAI personalization is optional and controlled via `USE_OPENAI` environment variable.

* Ensure your API key is valid in `.env`.

* Rule-based recommendations are used as fallback if OpenAI call fails.
