const express = require("express");
const {
  createPlan,
  getCurrentPlans,
  getPlanHistory,
  advancePlan,
} = require("../controllers/planController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.post("/", createPlan);
router.get("/current", getCurrentPlans);
router.get("/history", getPlanHistory);
router.post("/:id/advance", advancePlan);

module.exports = router;
