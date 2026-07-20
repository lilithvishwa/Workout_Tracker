import { motion } from "framer-motion";

export default function StreakCard({ streak }) {
  const current = streak?.currentStreak ?? 0;
  const best = streak?.bestStreak ?? 0;

  return (
    <div className="flex items-center gap-5 rounded-stamp border border-pine/10 bg-white/60 p-5 dark:bg-dusk-card dark:border-paper/10">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-ember bg-pine text-paper"
      >
        <div className="text-center">
          <div className="font-display text-3xl font-bold leading-none">{current}</div>
          <div className="text-[10px] uppercase tracking-wide text-paper/70">day streak</div>
        </div>
      </motion.div>
      <div>
        <h3 className="font-display text-lg font-semibold text-pine dark:text-paper">
          {current === 0 ? "Start your streak today" : "Keep the streak alive"}
        </h3>
        <p className="mt-1 text-sm text-pine/70 dark:text-paper/60">
          Best streak so far: <span className="font-mono font-medium">{best}</span> days
        </p>
      </div>
    </div>
  );
}
