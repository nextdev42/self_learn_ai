# AI-Powered LMS Backend (MVP)

This is an Express.js backend for an AI-powered LMS for Tanzania & East Africa.  
It handles:
- Onboarding questionnaire
- Personalized journey (rule-based for MVP)
- Progress tracking

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```
### 2. Start the server
```bash
node server.js
```
Server runs on http://localhost:4000

## 📌 API Tests with curl + Expected Output

### 1. Submit questionnaire

```bash
curl -X POST http://localhost:4000/api/questionnaire \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "answers": {
      "goal": "learn basics",
      "level": "beginner"
    }
  }'
```

### ✅ Example response:

```json
{
  "success": true,
  "response": {
    "id": "b7d1c0b6-1f9f-4b31-84f7-8aa4fdb5c7e1",
    "userId": "user123",
    "answers": {
      "goal": "learn basics",
      "level": "beginner"
    }
  }
}
```
### 2. Create personalized journey

```bash
curl -X POST http://localhost:4000/api/journey \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "level": "beginner"
  }'
```
### ✅ Example response:

```json
{
  "success": true,
  "journey": {
    "id": "ab12345c-6789-40ef-90ab-cdef12345678",
    "userId": "user123",
    "modules": [
      {
        "id": "m101",
        "title": "Intro to AI (Swahili)",
        "duration_minutes": 10,
        "level": "beginner"
      },
      {
        "id": "m102",
        "title": "Python Basics",
        "duration_minutes": 15,
        "level": "beginner"
      }
    ],
    "currentIndex": 0,
    "createdAt": "2025-10-01T12:00:00.000Z"
  }
}
```
### 3. Fetch journey for a user

```bash
curl http://localhost:4000/api/journey/user123
```

### ✅ Example response:

```json
{
  "id": "ab12345c-6789-40ef-90ab-cdef12345678",
  "userId": "user123",
  "modules": [
    {
      "id": "m101",
      "title": "Intro to AI (Swahili)",
      "duration_minutes": 10,
      "level": "beginner"
    },
    {
      "id": "m102",
      "title": "Python Basics",
      "duration_minutes": 15,
      "level": "beginner"
    }
  ],
  "currentIndex": 0,
  "createdAt": "2025-10-01T12:00:00.000Z"
}
```

### 4. Update progress

```bash
curl -X POST http://localhost:4000/api/progress \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "moduleId": "m101",
    "status": "completed",
    "score": 80
  }'
```

### ✅ Example response:

```json
{
  "success": true,
  "entry": {
    "userId": "user123",
    "moduleId": "m101",
    "status": "completed",
    "score": 80,
    "updatedAt": "2025-10-01T12:05:00.000Z"
  }
}
```

### 5. Fetch user progress

```bash
curl http://localhost:4000/api/progress/user123
```
### ✅ Example response:

```json
[
  {
    "userId": "user123",
    "moduleId": "m101",
    "status": "completed",
    "score": 80,
    "updatedAt": "2025-10-01T12:05:00.000Z"
  }
]
```

## 🛠 Next Steps

- Branch openai-integration will add AI-powered personalization using OpenAI.

- Current branch stays rules-only (filters modules by level).

- Later: add JWT auth, database persistence, gamification & rewards.
