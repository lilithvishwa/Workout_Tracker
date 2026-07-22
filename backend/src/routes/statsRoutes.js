const express = require("express");
const { getExerciseProgress, getMonthlySummary, getDayDetail, getYearHeatmap } = require("../controllers/statsController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.get("/exercise-progress", getExerciseProgress);
router.get("/monthly-summary", getMonthlySummary);
router.get("/day/:date", getDayDetail);
router.get("/heatmap", getYearHeatmap);

module.exports = router;
