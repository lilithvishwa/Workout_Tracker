const webpush = require("web-push");

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || "mailto:you@example.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

module.exports = webpush;
