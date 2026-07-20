const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },

    // Reminder / notification settings
    reminderTime: { type: String, default: "20:00" }, // HH:mm, 24hr, local to user's timezone
    timezone: { type: String, default: "Asia/Kolkata" },
    reminderEnabled: { type: Boolean, default: true },

    // Streak freeze (Duolingo-style safety valve)
    streakFreezesAvailable: { type: Number, default: 1 },
    streakFreezesUsedThisMonth: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
