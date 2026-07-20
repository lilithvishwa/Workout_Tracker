const WorkoutLog = require("../models/WorkoutLog");
const { recalculateStreakOnLog } = require("../utils/streakCalculator");

// @route POST /api/workouts
// Body: { date: "2026-07-19", status: "completed"|"rest"|"missed", exercisesDone: [{name, reps}], breakReason, note }
const upsertWorkoutLog = async (req, res, next) => {
  try {
    const { date, status, exercisesDone, breakReason, note } = req.body;

    if (!date || !status) {
      return res.status(400).json({ message: "date and status are required" });
    }
    if (status === "missed" && !breakReason?.category) {
      return res.status(400).json({ message: "breakReason.category is required when status is 'missed'" });
    }

    const log = await WorkoutLog.findOneAndUpdate(
      { user: req.user._id, date },
      {
        user: req.user._id,
        date,
        status,
        exercisesDone: exercisesDone || [],
        breakReason: status === "missed" ? breakReason : undefined,
        note,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const streak = await recalculateStreakOnLog(req.user._id, log);

    res.status(200).json({ log, streak });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/workouts?month=2026-07
const getMonthLogs = async (req, res, next) => {
  try {
    const { month } = req.query; // "YYYY-MM"
    if (!month) {
      return res.status(400).json({ message: "month query param required, e.g. ?month=2026-07" });
    }

    const logs = await WorkoutLog.find({
      user: req.user._id,
      date: { $regex: `^${month}` },
    }).sort({ date: 1 });

    res.json(logs);
  } catch (error) {
    next(error);
  }
};

// @route GET /api/workouts/:date  (e.g. /api/workouts/2026-07-19)
const getDayLog = async (req, res, next) => {
  try {
    const log = await WorkoutLog.findOne({ user: req.user._id, date: req.params.date });
    res.json(log || null);
  } catch (error) {
    next(error);
  }
};

module.exports = { upsertWorkoutLog, getMonthLogs, getDayLog };
