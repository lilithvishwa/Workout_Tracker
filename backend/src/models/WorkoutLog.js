const mongoose = require("mongoose");

const workoutLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Store date as "YYYY-MM-DD" string (not a Date object) to avoid timezone
    // headaches when checking "did the user log today".
    date: { type: String, required: true },

    status: {
      type: String,
      enum: ["completed", "rest", "missed"],
      required: true,
    },

    // What the user actually did (matched against that month's plan target)
    exercisesDone: [
      {
        name: String, // e.g. "squats", "pushups"
        reps: Number,
      },
    ],

    // Only relevant when status === "missed"
    breakReason: {
      category: {
        type: String,
        enum: ["sick", "travel", "injury", "no_motivation", "work", "other"],
      },
      note: { type: String, trim: true },
    },

    // Was a streak freeze used to protect this day instead of counting it as missed
    freezeUsed: { type: Boolean, default: false },

    note: { type: String, trim: true }, // optional daily journal / how they felt
  },
  { timestamps: true }
);

// One log per user per day
workoutLogSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("WorkoutLog", workoutLogSchema);
