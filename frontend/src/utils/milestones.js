export const MILESTONES = [
  { days: 7, label: "1 Week Strong", emoji: "🔥" },
  { days: 30, label: "1 Month Streak", emoji: "🏅" },
  { days: 100, label: "100 Day Club", emoji: "💎" },
  { days: 365, label: "1 Year Streak", emoji: "👑" },
];

// Returns the milestone that was just crossed (if any) when streak goes from
// oldValue -> newValue, e.g. oldValue=6, newValue=7 crosses the "1 Week" milestone.
export function checkMilestone(oldValue, newValue) {
  return MILESTONES.find((m) => oldValue < m.days && newValue >= m.days) || null;
}
