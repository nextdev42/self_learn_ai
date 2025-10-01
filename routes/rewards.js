const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const rewardsFile = path.join(__dirname, "../data/rewards.json");

// Load rewards from file
function loadRewards() {
  if (!fs.existsSync(rewardsFile)) return [];
  const raw = fs.readFileSync(rewardsFile, "utf8");
  try {
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

// Save rewards to file
function saveRewards(data) {
  fs.writeFileSync(rewardsFile, JSON.stringify(data, null, 2));
}

// Predefined reward rules
const rewardRules = [
  { id: "r001", title: "First Module Completed", criteria: { modulesCompleted: 1 }, points: 10 },
  { id: "r002", title: "Complete 3 Modules", criteria: { modulesCompleted: 3 }, points: 30 },
  { id: "r003", title: "Top Scorer in a Module", criteria: { scoreAbove: 90 }, points: 20 }
];

// Evaluate rewards
router.post("/evaluate", (req, res) => {
  const { userId, progress } = req.body;
  const earnedRewards = [];
  const existingRewards = loadRewards();

  rewardRules.forEach(rule => {
    let earned = false;

    if (rule.criteria.modulesCompleted) {
      const completedCount = progress.filter(p => p.status === "completed").length;
      earned = completedCount >= rule.criteria.modulesCompleted;
    }
    if (rule.criteria.scoreAbove) {
      earned = progress.some(p => p.score >= rule.criteria.scoreAbove);
    }

    // Avoid duplicates
    if (earned && !existingRewards.some(r => r.userId === userId && r.id === rule.id)) {
      const rewardEntry = {
        userId,
        id: rule.id,
        title: rule.title,
        criteria: rule.criteria,
        points: rule.points,
        earnedAt: new Date().toISOString()
      };
      existingRewards.push(rewardEntry);
      earnedRewards.push(rewardEntry);
    }
  });

  saveRewards(existingRewards);
  res.json({ success: true, earned: earnedRewards });
});

// Get rewards for a user
router.get("/:userId", (req, res) => {
  const rewards = loadRewards().filter(r => r.userId === req.params.userId);
  res.json(rewards);
});

// Leaderboard: top users by total points
router.get("/leaderboard", (req, res) => {
  const allRewards = loadRewards();
  const leaderboardMap = {};

  allRewards.forEach(r => {
    if (!leaderboardMap[r.userId]) leaderboardMap[r.userId] = 0;
    leaderboardMap[r.userId] += r.points;
  });

  const leaderboard = Object.entries(leaderboardMap)
    .map(([userId, points]) => ({ userId, points }))
    .sort((a, b) => b.points - a.points);

  res.json(leaderboard);
});

module.exports = router;
