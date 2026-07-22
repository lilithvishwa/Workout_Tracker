const crypto = require("crypto");
const User = require("../models/User");
const Streak = require("../models/Streak");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");

// @route POST /api/auth/register
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const user = await User.create({ name, email, password });
    await Streak.create({ user: user._id }); // initialize empty streak record

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @route POST /api/auth/login
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/auth/me
const getProfile = async (req, res, next) => {
  try {
    res.json(req.user);
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/auth/reminder-settings
const updateReminderSettings = async (req, res, next) => {
  try {
    const { reminderTime, timezone, reminderEnabled } = req.body;
    const user = await User.findById(req.user._id);

    if (reminderTime !== undefined) user.reminderTime = reminderTime;
    if (timezone !== undefined) user.timezone = timezone;
    if (reminderEnabled !== undefined) user.reminderEnabled = reminderEnabled;

    await user.save();
    res.json({ message: "Reminder settings updated", user });
  } catch (error) {
    next(error);
  }
};

// @route POST /api/auth/forgot-password
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Always respond with the same generic message, whether or not the email
    // exists — prevents leaking which emails are registered.
    const genericResponse = {
      message: "If an account exists with that email, a reset link has been sent.",
    };

    if (!user) return res.json(genericResponse);

    const rawToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    user.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL?.split(",")[0]}/reset-password/${rawToken}`;

    await sendEmail({
      to: user.email,
      subject: "Reset your Trailmark password",
      html: `
        <p>Hi ${user.name},</p>
        <p>You requested a password reset. This link expires in 30 minutes:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      `,
    });

    res.json(genericResponse);
  } catch (error) {
    next(error);
  }
};

// @route POST /api/auth/reset-password/:token
const resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Reset link is invalid or has expired" });
    }

    user.password = password; // pre-save hook hashes it
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: "Password reset successful. You can now log in." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateReminderSettings,
  forgotPassword,
  resetPassword,
};
