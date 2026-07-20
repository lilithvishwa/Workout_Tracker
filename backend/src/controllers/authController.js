const User = require("../models/User");
const Streak = require("../models/Streak");
const generateToken = require("../utils/generateToken");

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

module.exports = { registerUser, loginUser, getProfile, updateReminderSettings };
