const PushSubscription = require("../models/PushSubscription");

// @route GET /api/notifications/vapid-public-key
const getVapidPublicKey = (req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
};

// @route POST /api/notifications/subscribe
// Body: PushSubscription object from the browser's pushManager.subscribe()
const saveSubscription = async (req, res, next) => {
  try {
    const { endpoint, keys } = req.body;
    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return res.status(400).json({ message: "Invalid subscription payload" });
    }

    await PushSubscription.findOneAndUpdate(
      { user: req.user._id, endpoint },
      { user: req.user._id, endpoint, keys },
      { upsert: true }
    );

    res.status(201).json({ message: "Subscription saved" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getVapidPublicKey, saveSubscription };
