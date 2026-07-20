const mongoose = require("mongoose");

// Every time the target changes (e.g. new month +10), we insert a NEW document
// instead of overwriting — this gives you a full history to chart later.
const exercisePlanSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    exerciseName: { type: String, required: true, trim: true }, // "squats", "pushups"
    targetReps: { type: Number, required: true },
    incrementPerMonth: { type: Number, default: 10 },
    effectiveFrom: { type: String, required: true }, // "YYYY-MM-DD" first day this target applies
  },
  { timestamps: true }
);

exercisePlanSchema.index({ user: 1, exerciseName: 1, effectiveFrom: 1 });

module.exports = mongoose.model("ExercisePlan", exercisePlanSchema);
