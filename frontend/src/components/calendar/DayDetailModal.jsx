import { format, parseISO } from "date-fns";
import { Check, Coffee, X, Pencil } from "lucide-react";

const statusMeta = {
  completed: { label: "Completed", icon: Check, color: "text-pine dark:text-paper" },
  rest: { label: "Rest day", icon: Coffee, color: "text-moss" },
  missed: { label: "Missed", icon: X, color: "text-clay" },
};

export default function DayDetailModal({ log, dateStr, onClose, onEdit }) {
  const meta = statusMeta[log.status];
  const Icon = meta.icon;

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-ink/40 p-4 sm:items-center">
      <div className="w-full max-w-sm rounded-stamp bg-paper p-6 dark:bg-dusk-card">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-pine dark:text-paper">
            {format(parseISO(dateStr), "EEEE, MMM d")}
          </h3>
          <button onClick={onEdit} className="flex items-center gap-1 text-xs text-ember">
            <Pencil size={14} /> Edit
          </button>
        </div>

        <div className={`mt-3 flex items-center gap-2 text-sm font-medium ${meta.color}`}>
          <Icon size={16} /> {meta.label}
        </div>

        {log.status === "completed" && log.exercisesDone?.length > 0 && (
          <div className="mt-4 space-y-2">
            {log.exercisesDone.map((ex) => (
              <div key={ex.name} className="flex justify-between text-sm">
                <span className="capitalize text-pine/80 dark:text-paper/70">{ex.name}</span>
                <span className="font-mono font-medium text-pine dark:text-paper">{ex.reps} reps</span>
              </div>
            ))}
          </div>
        )}

        {log.status === "missed" && log.breakReason?.category && (
          <div className="mt-4 rounded-stamp bg-clay/10 p-3 text-sm text-clay">
            <span className="capitalize font-medium">{log.breakReason.category}</span>
            {log.breakReason.note && <p className="mt-1 text-clay/80">"{log.breakReason.note}"</p>}
          </div>
        )}

        {log.note && (
          <p className="mt-3 text-sm italic text-pine/60 dark:text-paper/50">"{log.note}"</p>
        )}

        <button
          onClick={onClose}
          className="mt-5 w-full rounded-stamp border border-pine/20 py-2 text-sm text-pine dark:text-paper dark:border-paper/20"
        >
          Close
        </button>
      </div>
    </div>
  );
}
