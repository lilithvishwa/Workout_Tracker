const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const workoutRoutes = require("./routes/workoutRoutes");
const streakRoutes = require("./routes/streakRoutes");
const planRoutes = require("./routes/planRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const statsRoutes = require("./routes/statsRoutes");
const { errorHandler, notFound } = require("./middleware/errorHandler");

const app = express();

// CLIENT_URL can be a comma-separated list, e.g.
// "https://your-app.vercel.app,http://localhost:5173"
// Trailing slashes are stripped since "https://x.com/" !== "https://x.com" to the
// browser's Origin header, which was silently causing login/CORS failures.
const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((o) => o.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // requests with no origin (curl, mobile apps, Postman, server-to-server) are allowed
      if (!origin) return callback(null, true);
      if (allowedOrigins.length === 0) return callback(null, true); // not configured yet — allow all (dev fallback)

      const normalizedOrigin = origin.replace(/\/$/, "");
      const isAllowed =
        allowedOrigins.includes(normalizedOrigin) ||
        // allow any Vercel preview deployment of the same project (e.g. app-git-branch-user.vercel.app)
        (normalizedOrigin.endsWith(".vercel.app") &&
          allowedOrigins.some((a) => a.endsWith(".vercel.app")));

      if (isAllowed) return callback(null, true);

      console.warn(`CORS blocked request from origin: ${origin}`);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => res.json({ status: "Trailmark API running" }));
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/streak", streakRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/stats", statsRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
