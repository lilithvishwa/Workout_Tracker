const { format, addMonths, parseISO } = require("date-fns");
const ExercisePlan = require("../models/ExercisePlan");

const DATE_FMT = "yyyy-MM-dd";

// @route POST /api/plans
// Body: { exerciseName: "squats", targetReps: 70, incrementPerMonth: 10, effectiveFrom: "2026-08-01" }
const createPlan = async (req, res, next) => {
  try {
    const { exerciseName, targetReps, incrementPerMonth, effectiveFrom } = req.body;

    if (!exerciseName || !targetReps || !effectiveFrom) {
      return res.status(400).json({ message: "exerciseName, targetReps, effectiveFrom are required" });
    }

    const plan = await ExercisePlan.create({
      user: req.user._id,
      exerciseName,
      targetReps,
      incrementPerMonth: incrementPerMonth ?? 10,
      effectiveFrom,
    });

    res.status(201).json(plan);
  } catch (error) {
    next(error);
  }
};

// @route GET /api/plans/current
// Returns the currently active target for each exercise (the latest plan whose effectiveFrom <= today)
const getCurrentPlans = async (req, res, next) => {
  try {
    const today = format(new Date(), DATE_FMT);
    const allPlans = await ExercisePlan.find({
      user: req.user._id,
      effectiveFrom: { $lte: today },
    }).sort({ effectiveFrom: -1 });

    // Keep only the most recent plan per exercise
    const latestByExercise = {};
    for (const plan of allPlans) {
      if (!latestByExercise[plan.exerciseName]) {
        latestByExercise[plan.exerciseName] = plan;
      }
    }

    res.json(Object.values(latestByExercise));
  } catch (error) {
    next(error);
  }
};

// @route GET /api/plans/history?exerciseName=squats
const getPlanHistory = async (req, res, next) => {
  try {
    const { exerciseName } = req.query;
    const filter = { user: req.user._id };
    if (exerciseName) filter.exerciseName = exerciseName;

    const plans = await ExercisePlan.find(filter).sort({ effectiveFrom: 1 });
    res.json(plans);
  } catch (error) {
    next(error);
  }
};

// @route POST /api/plans/:id/advance
// Manually trigger "next month" increment for a plan (also can be automated via cron)
const advancePlan = async (req, res, next) => {
  try {
    const current = await ExercisePlan.findOne({ _id: req.params.id, user: req.user._id });
    if (!current) return res.status(404).json({ message: "Plan not found" });

    const nextEffectiveFrom = format(addMonths(parseISO(current.effectiveFrom), 1), DATE_FMT);

    const newPlan = await ExercisePlan.create({
      user: req.user._id,
      exerciseName: current.exerciseName,
      targetReps: current.targetReps + current.incrementPerMonth,
      incrementPerMonth: current.incrementPerMonth,
      effectiveFrom: nextEffectiveFrom,
    });

    res.status(201).json(newPlan);
  } catch (error) {
    next(error);
  }
};

module.exports = { createPlan, getCurrentPlans, getPlanHistory, advancePlan };
