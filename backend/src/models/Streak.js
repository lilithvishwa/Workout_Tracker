const mongoose = require("mongoose");

const streakSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    currentStreak: { type: Number, default: 0 },
    bestStreak: { type: Number, default: 0 },
    totalWorkoutDays: { type: Number, default: 0 }, // lifetime total, derived from completed logs
    lastCompletedDate: { type: String, default: null }, // "YYYY-MM-DD"
    lastBreakReason: {
      category: String,
      note: String,
      date: String,
    },
    // History of past streaks, so "if I break, my last streak record" is available.
    // Fully regenerated on every recompute — never patched incrementally.
    streakHistory: [
      {
        length: Number,
        startDate: String,
        endDate: String,
        endedByReason: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Streak", streakSchema);
