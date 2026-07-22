const express = require("express");
const {
  registerUser,
  loginUser,
  getProfile,
  updateReminderSettings,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getProfile);
router.put("/reminder-settings", protect, updateReminderSettings);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
