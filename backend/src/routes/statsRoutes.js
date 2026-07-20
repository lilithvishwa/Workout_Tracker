const express = require("express");
const { getExerciseProgress, getMonthlySummary, getDayDetail } = require("../controllers/statsController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.get("/exercise-progress", getExerciseProgress);
router.get("/monthly-summary", getMonthlySummary);
router.get("/day/:date", getDayDetail);

module.exports = router;
