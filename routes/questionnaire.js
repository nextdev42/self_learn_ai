const express = require("express");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

// In-memory storage for now
let questionnaireResponses = [];

router.post("/", (req, res) => {
  const { userId, answers } = req.body;
  const response = { id: uuidv4(), userId, answers };
  questionnaireResponses.push(response);
  res.json({ success: true, response });
});

module.exports = router;