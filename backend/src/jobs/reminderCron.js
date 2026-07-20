const cron = require("node-cron");
const { format } = require("date-fns");
const User = require("../models/User");
const WorkoutLog = require("../models/WorkoutLog");
const PushSubscription = require("../models/PushSubscription");
const webpush = require("../utils/webPush");

const DATE_FMT = "yyyy-MM-dd";

/**
 * Runs every 5 minutes. For each user, checks if the current time in THEIR
 * timezone matches their chosen reminderTime, and if so, checks whether
 * today's workout has been logged yet. If not, sends a push notification.
 *
 * Note: matching "current time == reminderTime" every 5 min is a simple approach
 * good enough for an MVP. At scale you'd schedule per-user jobs instead.
 */
function startReminderCron() {
  cron.schedule("*/5 * * * *", async () => {
    try {
      const users = await User.find({ reminderEnabled: true });

      for (const user of users) {
        const nowInUserTz = new Date(
          new Date().toLocaleString("en-US", { timeZone: user.timezone })
        );
        const currentHHMM = format(nowInUserTz, "HH:mm");
        const todayStr = format(nowInUserTz, DATE_FMT);

        // Only fire within the 5-minute window matching reminderTime
        if (currentHHMM !== user.reminderTime) continue;

        const todayLog = await WorkoutLog.findOne({ user: user._id, date: todayStr });
        if (todayLog) continue; // already logged today, no need to remind

        const subscriptions = await PushSubscription.find({ user: user._id });
        const payload = JSON.stringify({
          title: "Don't break your streak! 🔥",
          body: "You haven't logged today's workout yet. Tap to check in.",
        });

        for (const sub of subscriptions) {
          try {
            await webpush.sendNotification(
              { endpoint: sub.endpoint, keys: sub.keys },
              payload
            );
          } catch (err) {
            console.error(`Push failed for user ${user._id}:`, err.message);
          }
        }
      }
    } catch (error) {
      console.error("Reminder cron error:", error.message);
    }
  });

  console.log("Reminder cron job scheduled (every 5 min check).");
}

module.exports = startReminderCron;
