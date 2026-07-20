const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const workoutRoutes = require("./routes/workoutRoutes");
const streakRoutes = require("./routes/streakRoutes");
const planRoutes = require("./routes/planRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const { errorHandler, notFound } = require("./middleware/errorHandler");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/streak", streakRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/notifications", notificationRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
