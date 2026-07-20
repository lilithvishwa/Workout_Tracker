const express = require("express");
const { getVapidPublicKey, saveSubscription } = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/vapid-public-key", getVapidPublicKey);
router.post("/subscribe", protect, saveSubscription);

module.exports = router;
