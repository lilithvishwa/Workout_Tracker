const { differenceInCalendarDays, parseISO } = require("date-fns");
const WorkoutLog = require("../models/WorkoutLog");
const Streak = require("../models/Streak");

/**
 * Recomputes a user's ENTIRE streak state by replaying every WorkoutLog they
 * have, in chronological order. This is deliberately NOT an incremental
 * patch — incremental patching is what caused the double-counting and
 * streak-reset bugs. Replaying from source-of-truth logs means the streak
 * is always internally consistent, no matter how many times a day gets
 * edited, re-submitted, or logged out of order.
 *
 * Rules:
 * - "completed" extends the streak by 1, but only if it's exactly one
 *   calendar day after the previously processed log. Any gap (including an
 *   un-logged day with no entry at all) breaks the streak.
 * - "rest" does not add to the streak, but also does not break it, as long
 *   as it's contiguous with the previous log.
 * - "missed" always breaks the streak and is archived into streakHistory.
 * - Total workout days = count of "completed" logs, full stop.
 */
async function recomputeStreak(userId) {
  const logs = await WorkoutLog.find({ user: userId }).sort({ date: 1 });

  let currentStreak = 0;
  let bestStreak = 0;
  let totalWorkoutDays = 0;
  let currentStreakStart = null;
  let lastDate = null;
  let lastCompletedDate = null;
  let lastBreakReason = null;
  const streakHistory = [];

  const breakStreak = (reasonCategory, endDate) => {
    if (currentStreak > 0) {
      streakHistory.push({
        length: currentStreak,
        startDate: currentStreakStart,
        endDate,
        endedByReason: reasonCategory,
      });
    }
    currentStreak = 0;
    currentStreakStart = null;
  };

  for (const log of logs) {
    const gapExists =
      lastDate !== null && differenceInCalendarDays(parseISO(log.date), parseISO(lastDate)) !== 1;

    if (gapExists) {
      breakStreak("unlogged_gap", lastDate);
    }

    if (log.status === "completed") {
      if (currentStreak === 0) currentStreakStart = log.date;
      currentStreak += 1;
      totalWorkoutDays += 1;
      lastCompletedDate = log.date;
      if (currentStreak > bestStreak) bestStreak = currentStreak;
    } else if (log.status === "missed") {
      breakStreak(log.breakReason?.category || "other", log.date);
      lastBreakReason = {
        category: log.breakReason?.category,
        note: log.breakReason?.note,
        date: log.date,
      };
    }
    // "rest" does nothing to currentStreak — it just passes through

    lastDate = log.date;
  }

  const streak = await Streak.findOneAndUpdate(
    { user: userId },
    {
      user: userId,
      currentStreak,
      bestStreak,
      totalWorkoutDays,
      lastCompletedDate,
      lastBreakReason: lastBreakReason || undefined,
      streakHistory,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return streak;
}

module.exports = { recomputeStreak };
