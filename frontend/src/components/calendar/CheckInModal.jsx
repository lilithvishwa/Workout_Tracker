import { useState } from "react";

export default function CheckInModal({ date, plans, onCancel, onSubmit }) {
  const [reps, setReps] = useState(
    Object.fromEntries(plans.map((p) => [p.exerciseName, p.targetReps]))
  );

  const handleSubmit = () => {
    const exercisesDone = Object.entries(reps).map(([name, value]) => ({
      name,
      reps: Number(value),
    }));
    onSubmit(exercisesDone);
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-ink/40 p-4">
      <div className="w-full max-w-sm rounded-stamp bg-paper p-6 dark:bg-dusk-card">
        <h3 className="font-display text-lg font-semibold text-pine dark:text-paper">
          Log workout — {date}
        </h3>

        <div className="mt-4 space-y-3">
          {plans.length === 0 && (
            <p className="text-sm text-pine/60 dark:text-paper/50">
              No exercise plan set yet — add one in the Planner tab. You can still check in below.
            </p>
          )}
          {plans.map((p) => (
            <div key={p.exerciseName} className="flex items-center justify-between gap-3">
              <label className="text-sm capitalize text-pine dark:text-paper">
                {p.exerciseName} <span className="text-pine/40">(target {p.targetReps})</span>
              </label>
              <input
                type="number"
                value={reps[p.exerciseName]}
                onChange={(e) => setReps({ ...reps, [p.exerciseName]: e.target.value })}
                className="w-20 rounded-stamp border border-pine/20 bg-transparent px-2 py-1 text-right font-mono text-sm dark:border-paper/20"
              />
            </div>
          ))}
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onCancel} className="px-3 py-2 text-sm text-pine/60 dark:text-paper/50">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-stamp bg-ember px-4 py-2 text-sm font-medium text-paper"
          >
            Mark completed
          </button>
        </div>
      </div>
    </div>
  );
}
