const express = require("express");
const router = express.Router();

// In-memory progress
let progress = [];

router.post("/", (req, res) => {
  const { userId, moduleId, status, score } = req.body;
  const entry = { userId, moduleId, status, score, updatedAt: new Date() };
  progress.push(entry);
  res.json({ success: true, entry });
});

router.get("/:userId", (req, res) => {
  const userProgress = progress.filter(p => p.userId === req.params.userId);
  res.json(userProgress);
});

module.exports = router;