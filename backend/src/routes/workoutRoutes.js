const express = require("express");
const { upsertWorkoutLog, getMonthLogs, getDayLog } = require("../controllers/workoutController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.post("/", upsertWorkoutLog);
router.get("/", getMonthLogs);
router.get("/:date", getDayLog);

module.exports = router;
