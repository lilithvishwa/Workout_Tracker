import { useState } from "react";

const REASONS = [
  { value: "sick", label: "Sick" },
  { value: "travel", label: "Travel" },
  { value: "injury", label: "Injury" },
  { value: "no_motivation", label: "No motivation" },
  { value: "work", label: "Work" },
  { value: "other", label: "Other" },
];

export default function BreakReasonModal({ date, onCancel, onSubmit }) {
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-ink/40 p-4">
      <div className="w-full max-w-sm rounded-stamp bg-paper p-6 dark:bg-dusk-card">
        <h3 className="font-display text-lg font-semibold text-pine dark:text-paper">
          Why did you miss {date}?
        </h3>
        <p className="mt-1 text-sm text-pine/60 dark:text-paper/50">
          This resets your streak, but tracking why helps you spot patterns.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {REASONS.map((r) => (
            <button
              key={r.value}
              onClick={() => setCategory(r.value)}
              className={`rounded-stamp border px-3 py-2 text-sm ${
                category === r.value
                  ? "border-clay bg-clay text-paper"
                  : "border-pine/20 text-pine dark:text-paper dark:border-paper/20"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional note..."
          className="mt-3 w-full rounded-stamp border border-pine/20 bg-transparent p-2 text-sm text-pine dark:text-paper dark:border-paper/20"
          rows={2}
        />

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onCancel} className="px-3 py-2 text-sm text-pine/60 dark:text-paper/50">
            Cancel
          </button>
          <button
            disabled={!category}
            onClick={() => onSubmit({ category, note })}
            className="rounded-stamp bg-clay px-4 py-2 text-sm font-medium text-paper disabled:opacity-40"
          >
            Confirm break
          </button>
        </div>
      </div>
    </div>
  );
}
