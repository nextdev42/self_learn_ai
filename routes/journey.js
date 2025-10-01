const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const { generateJourneyWithAI } = require("../services/openaiClient");

const router = express.Router();

let journeys = [];
const modulesPath = path.join(__dirname, "../data/modules.json");
const modules = JSON.parse(fs.readFileSync(modulesPath, "utf8"));

router.post("/", async (req, res) => {
  const { userId, level, questionnaireAnswers } = req.body;

  console.log("Received journey request:", { userId, level, questionnaireAnswers });

  // Default rule-based selection
  let recommendedModules = modules.filter(m => m.level === level);
  let finalModules = recommendedModules;

  // OpenAI personalization
  if (process.env.USE_OPENAI === "true") {
    try {
      const learnerProfile = { userId, level, questionnaireAnswers };
      console.log("Calling OpenAI with profile:", learnerProfile);

      const aiModules = await generateJourneyWithAI(learnerProfile, modules);

      console.log("AI returned modules:", aiModules);

      if (Array.isArray(aiModules) && aiModules.length > 0) finalModules = aiModules;
    } catch (err) {
      console.warn("AI journey generation failed, using rule-based fallback");
      console.error("OpenAI error:", err.message || err);
    }
  }

  const journey = {
    id: uuidv4(),
    userId,
    modules: finalModules,
    currentIndex: 0,
    createdAt: new Date()
  };

  journeys.push(journey);

  console.log("Final journey modules:", finalModules);

  res.json({ success: true, journey });
});

router.get("/:userId", (req, res) => {
  const journey = journeys.find(j => j.userId === req.params.userId);
  if (!journey) return res.status(404).json({ error: "Journey not found" });
  res.json(journey);
});

module.exports = router;
