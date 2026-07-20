const { format, subDays, parseISO } = require("date-fns");
const Streak = require("../models/Streak");

const DATE_FMT = "yyyy-MM-dd";

const yesterdayOf = (dateStr) => format(subDays(parseISO(dateStr), 1), DATE_FMT);

/**
 * Recalculates the user's streak whenever a WorkoutLog is created or updated.
 *
 * Rules:
 * - "completed": counts toward the streak. Continues the streak only if the
 *   immediately preceding day was logged and was NOT "missed". Otherwise starts fresh at 1.
 * - "rest": does NOT break the streak and does NOT increment it. It just needs
 *   the previous day to not already be a broken chain.
 * - "missed": breaks the streak. The current streak length (if > 0) is archived
 *   into streakHistory before resetting to 0.
 *
 * @param {ObjectId} userId
 * @param {Object} log - the WorkoutLog document just saved { date, status }
 */
async function recalculateStreakOnLog(userId, log) {
  let streak = await Streak.findOne({ user: userId });
  if (!streak) {
    streak = await Streak.create({ user: userId });
  }

  const prevDay = yesterdayOf(log.date);
  // Chain is intact if the last logged day was literally yesterday AND wasn't a miss.
  const chainIntact =
    streak.lastLoggedDate === prevDay && streak.lastBreakDate !== prevDay;

  if (log.status === "completed") {
    streak.currentStreak = chainIntact ? streak.currentStreak + 1 : 1;
    streak.totalWorkoutDays += 1;
    streak.lastCompletedDate = log.date;
    if (streak.currentStreak > streak.bestStreak) {
      streak.bestStreak = streak.currentStreak;
    }
  } else if (log.status === "rest") {
    if (!chainIntact) {
      streak.currentStreak = 0;
    }
    // else: streak stays exactly as-is, rest day is "free"
  } else if (log.status === "missed") {
    if (streak.currentStreak > 0) {
      streak.streakHistory.push({
        length: streak.currentStreak,
        startDate: null, // could be computed by walking WorkoutLog backwards if needed
        endDate: prevDay,
        endedByReason: log.breakReason?.category || "other",
      });
    }
    streak.currentStreak = 0;
    streak.lastBreakDate = log.date;
    streak.lastBreakReason = {
      category: log.breakReason?.category,
      note: log.breakReason?.note,
      date: log.date,
    };
  }

  streak.lastLoggedDate = log.date;
  await streak.save();
  return streak;
}

module.exports = { recalculateStreakOnLog };
