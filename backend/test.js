const mongoose = require("mongoose");

mongoose
  .connect("mongodb+srv://slilith885_db_user:W9UXJpyYp4tQ0mvg@workouttracker.ctb0kzt.mongodb.net/workout_tracker?retryWrites=true&w=majority")
  .then(() => {
    console.log("✅ Connected");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });