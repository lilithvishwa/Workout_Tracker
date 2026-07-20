const express = require("express");
const { getStreak, getStreakHistory } = require("../controllers/streakController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.get("/", getStreak);
router.get("/history", getStreakHistory);

module.exports = router;
