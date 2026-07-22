const express = require("express");
const { getStreak, getStreakHistory, recomputeStreakEndpoint } = require("../controllers/streakController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.get("/", getStreak);
router.get("/history", getStreakHistory);
router.post("/recompute", recomputeStreakEndpoint);

module.exports = router;
