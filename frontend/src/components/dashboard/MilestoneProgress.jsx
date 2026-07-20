import { MILESTONES } from "../../utils/milestones";

export default function MilestoneProgress({ currentStreak = 0 }) {
  const next = MILESTONES.find((m) => m.days > currentStreak);

  if (!next) {
    return (
      <div className="rounded-stamp border border-ember/30 bg-ember/10 p-4 text-sm text-ember">
        👑 You've unlocked every milestone badge. Legendary consistency.
      </div>
    );
  }

  const prevMilestone = [...MILESTONES].reverse().find((m) => m.days <= currentStreak);
  const floor = prevMilestone ? prevMilestone.days : 0;
  const pct = Math.round(((currentStreak - floor) / (next.days - floor)) * 100);

  return (
    <div className="rounded-stamp border border-pine/10 bg-white/60 p-4 dark:bg-dusk-card dark:border-paper/10">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-pine dark:text-paper">
          {next.emoji} {next.label}
        </span>
        <span className="font-mono text-pine/60 dark:text-paper/50">
          {currentStreak}/{next.days} days
        </span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-pine/10 dark:bg-paper/10">
        <div
          className="h-full rounded-full bg-ember transition-all"
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </div>
  );
}
