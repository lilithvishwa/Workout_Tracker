const Streak = require("../models/Streak");

// @route GET /api/streak
const getStreak = async (req, res, next) => {
  try {
    let streak = await Streak.findOne({ user: req.user._id });
    if (!streak) {
      streak = await Streak.create({ user: req.user._id });
    }
    res.json(streak);
  } catch (error) {
    next(error);
  }
};

// @route GET /api/streak/history
const getStreakHistory = async (req, res, next) => {
  try {
    const streak = await Streak.findOne({ user: req.user._id });
    res.json(streak?.streakHistory || []);
  } catch (error) {
    next(error);
  }
};

module.exports = { getStreak, getStreakHistory };
