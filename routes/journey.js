const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

// In-memory storage for journeys
let journeys = [];

// Load sample modules
const modulesPath = path.join(__dirname, "../data/modules.json");
const modules = JSON.parse(fs.readFileSync(modulesPath, "utf8"));

router.post("/", (req, res) => {
  const { userId, level } = req.body;

  // Simple rule-based selection for MVP
  let recommendedModules = modules.filter(m => m.level === level);

  const journey = {
    id: uuidv4(),
    userId,
    modules: recommendedModules,
    currentIndex: 0,
    createdAt: new Date()
  };
  journeys.push(journey);
  res.json({ success: true, journey });
});

router.get("/:userId", (req, res) => {
  const journey = journeys.find(j => j.userId === req.params.userId);
  if (!journey) return res.status(404).json({ error: "Journey not found" });
  res.json(journey);
});

module.exports = router;