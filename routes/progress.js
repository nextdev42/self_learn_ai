const express = require("express");
const router = express.Router();

// In-memory progress
let progress = [];

// In-memory rewards
let rewards = [];
const rewardDefinitions = [
  { id: "r001", title: "First Module Completed", criteria: { modulesCompleted: 1 }, points: 10 },
  { id: "r002", title: "Complete 3 Modules", criteria: { modulesCompleted: 3 }, points: 30 },
  { id: "r003", title: "Top Scorer in a Module", criteria: { scoreAbove: 90 }, points: 20 }
];

// Helper to evaluate rewards
function evaluateRewards(userId) {
  const userProgress = progress.filter(p => p.userId === userId);

  const earned = [];

  rewardDefinitions.forEach(r => {
    // Check if reward already earned
    const alreadyEarned = rewards.find(re => re.userId === userId && re.id === r.id);
    if (alreadyEarned) return;

    let qualifies = false;
    if (r.criteria.modulesCompleted) {
      const completedCount = userProgress.filter(p => p.status === "completed").length;
      qualifies = completedCount >= r.criteria.modulesCompleted;
    }
    if (r.criteria.scoreAbove) {
      qualifies = userProgress.some(p => p.score >= r.criteria.scoreAbove);
    }

    if (qualifies) {
      const newReward = { ...r, userId, earnedAt: new Date() };
      rewards.push(newReward);
      earned.push(newReward);
    }
  });

  return earned;
}

// POST /api/progress
router.post("/", (req, res) => {
  const { userId, moduleId, status, score } = req.body;
  const entry = { userId, moduleId, status, score, updatedAt: new Date() };
  progress.push(entry);

  // Automatically evaluate rewards
  const earnedRewards = evaluateRewards(userId);

  res.json({ success: true, entry, earnedRewards });
});

// GET /api/progress/:userId
router.get("/:userId", (req, res) => {
  const userProgress = progress.filter(p => p.userId === req.params.userId);
  res.json(userProgress);
});

// GET /api/rewards/:userId
router.get("/rewards/:userId", (req, res) => {
  const userRewards = rewards.filter(r => r.userId === req.params.userId);
  res.json(userRewards);
});

module.exports = router;
