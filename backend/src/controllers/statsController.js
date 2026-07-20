const { format, subMonths } = require("date-fns");
const WorkoutLog = require("../models/WorkoutLog");

const DATE_FMT = "yyyy-MM-dd";

// @route GET /api/stats/exercise-progress
// Returns every completed day's exercise reps, flattened, so the frontend can
// chart "squats over time", "pushups over time" etc.
const getExerciseProgress = async (req, res, next) => {
  try {
    const logs = await WorkoutLog.find({
      user: req.user._id,
      status: "completed",
    })
      .sort({ date: 1 })
      .select("date exercisesDone");

    const flattened = [];
    for (const log of logs) {
      for (const ex of log.exercisesDone) {
        flattened.push({ date: log.date, name: ex.name, reps: ex.reps });
      }
    }

    res.json(flattened);
  } catch (error) {
    next(error);
  }
};

// @route GET /api/stats/monthly-summary?months=6
// Returns counts of completed/rest/missed per month for the last N months.
const getMonthlySummary = async (req, res, next) => {
  try {
    const months = Number(req.query.months) || 6;
    const startMonth = format(subMonths(new Date(), months - 1), DATE_FMT).slice(0, 7);

    const logs = await WorkoutLog.find({
      user: req.user._id,
      date: { $gte: `${startMonth}-01` },
    }).select("date status");

    const byMonth = {};
    for (const log of logs) {
      const monthKey = log.date.slice(0, 7); // "YYYY-MM"
      if (!byMonth[monthKey]) {
        byMonth[monthKey] = { month: monthKey, completed: 0, rest: 0, missed: 0 };
      }
      byMonth[monthKey][log.status] += 1;
    }

    const result = Object.values(byMonth).sort((a, b) => a.month.localeCompare(b.month));
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// @route GET /api/stats/day/:date
// Full detail for a single day, used by the "click a day to see what you did" modal.
const getDayDetail = async (req, res, next) => {
  try {
    const log = await WorkoutLog.findOne({ user: req.user._id, date: req.params.date });
    res.json(log || null);
  } catch (error) {
    next(error);
  }
};

module.exports = { getExerciseProgress, getMonthlySummary, getDayDetail };
