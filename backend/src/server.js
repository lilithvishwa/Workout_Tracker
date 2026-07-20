require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
const startReminderCron = require("./jobs/reminderCron");

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
      startReminderCron();
    } else {
      console.log("VAPID keys not set — reminder cron disabled until configured.");
    }
  });
});
