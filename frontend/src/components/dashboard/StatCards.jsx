export default function StatCards({ streak }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="rounded-stamp border border-pine/10 bg-white/60 p-4 dark:bg-dusk-card dark:border-paper/10">
        <div className="font-mono text-2xl font-semibold text-pine dark:text-paper">
          {streak?.totalWorkoutDays ?? 0}
        </div>
        <div className="text-xs uppercase tracking-wide text-pine/60 dark:text-paper/50">
          Total workout days
        </div>
      </div>

      <div className="rounded-stamp border border-pine/10 bg-white/60 p-4 dark:bg-dusk-card dark:border-paper/10">
        <div className="font-mono text-2xl font-semibold text-clay">
          {streak?.streakHistory?.length
            ? streak.streakHistory[streak.streakHistory.length - 1].length
            : "—"}
        </div>
        <div className="text-xs uppercase tracking-wide text-pine/60 dark:text-paper/50">
          Last streak before break
        </div>
      </div>
    </div>
  );
}
