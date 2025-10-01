## 🚀 Getting Started

[](https://github.com/nextdev42/self_learn_ai/blob/main/README.md#-getting-started)

### 1. Install dependencies

[](https://github.com/nextdev42/self_learn_ai/blob/main/README.md#1-install-dependencies)

```
npm install
```

### 2. Start the server

[](https://github.com/nextdev42/self_learn_ai/blob/main/README.md#2-start-the-server)

```
node server.js
```

Server runs on <http://localhost:4000>

## 📌 API Tests with curl + Expected Output


### 1. Submit a Questionnaire
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

### Expected Response:

```json
{
  "success": true,
  "response": {
    "id": "uuid-generated",
    "userId": "user123",
    "answers": {
      "goal": "learn basics",
      "level": "beginner"
    }
  }
}

```

### 2\. Generate a Personalized Journey (AI-powered)

```json
curl -X POST http://localhost:4000/api/journey \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "level": "beginner",
    "questionnaireAnswers": {
      "goal": "learn basics"
    }
  }'

```
### Expected Response (example):
```json


{
  "success": true,
  "journey": {
    "id": "uuid-generated",
    "userId": "user123",
    "modules": [
      {
        "id": "m101",
        "title": "Intro to AI (Swahili)",
        "duration_minutes": 10,
        "learning_objectives": [
          "Understand the basics of artificial intelligence",
          "Learn key terms and concepts in AI"
        ],
        "difficulty": "beginner"
      },
      {
        "id": "m102",
        "title": "Python Basics",
        "duration_minutes": 15,
        "learning_objectives": [
          "Learn the fundamentals of Python programming",
          "Write simple Python scripts"
        ],
        "difficulty": "beginner"
      },
      {
        "id": "x_001",
        "title": "Introduction to Programming Concepts",
        "duration_minutes": 20,
        "learning_objectives": [
          "Understand basic programming concepts such as variables, loops, and functions",
          "Develop problem-solving skills through programming"
        ],
        "difficulty": "beginner"
      }
    ],
    "currentIndex": 0,
    "createdAt": "2025-10-01T12:25:08.425Z"
  }
}
```

### 3\. Update Module Progress

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

### Expected Response:

```json
{
  "success": true,
  "entry": {
    "userId": "user123",
    "moduleId": "m101",
    "status": "completed",
    "score": 80,
    "updatedAt": "2025-10-01T12:22:11.701Z"
  }
}

```

### ✅ Notes

* Ensure your `.env` file contains a valid `OPENAI_API_KEY`, `USE_OPENAI=true`, and `OPENAI_MODEL` (e.g., `gpt-4o-mini`).

* Run `npm start` before using curl.

* The AI may generate extra modules (`x_001`, `x_002`) in addition to your predefined ones.


