import { useEffect, useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  getDay,
  addMonths,
  subMonths,
  isAfter,
  startOfDay,
} from "date-fns";
import { ChevronLeft, ChevronRight, Check, X, Coffee } from "lucide-react";
import { useWorkoutStore } from "../../store/workoutStore";
import { getCurrentPlansApi } from "../../api/planApi";
import BreakReasonModal from "./BreakReasonModal";
import DayDetailModal from "./DayDetailModal";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import { checkMilestone } from "../../utils/milestones";

const statusStyles = {
  completed: "bg-pine text-paper stamp-completed",
  rest: "bg-moss/40 text-pine dark:text-paper",
  missed: "bg-clay/20 text-clay",
};

export default function WorkoutCalendar() {
  const [monthCursor, setMonthCursor] = useState(new Date());
  const [plans, setPlans] = useState([]);
  const [activeDate, setActiveDate] = useState(null); // date open in the check-in flow (new or edit)
  const [viewDate, setViewDate] = useState(null); // date open in the read-only detail modal
  const [pendingBreak, setPendingBreak] = useState(null);

  const { monthLogs, fetchMonthLogs, logWorkout } = useWorkoutStore();
  const monthStr = format(monthCursor, "yyyy-MM");

  useEffect(() => {
    fetchMonthLogs(monthStr);
  }, [monthStr]);

  useEffect(() => {
    getCurrentPlansApi().then((res) => setPlans(res.data));
  }, []);

  const days = eachDayOfInterval({
    start: startOfMonth(monthCursor),
    end: endOfMonth(monthCursor),
  });

  const logFor = (dateStr) => monthLogs.find((l) => l.date === dateStr);
  const today = startOfDay(new Date());

  const handleDayClick = (day, dateStr) => {
    if (isAfter(startOfDay(day), today)) return; // future dates are disabled
    const log = logFor(dateStr);
    if (log) {
      setViewDate(dateStr);
    } else {
      setActiveDate(dateStr);
    }
  };

  const handleMarkRest = async (dateStr) => {
    try {
      await logWorkout({ date: dateStr, status: "rest" });
      toast.success("Marked as rest day — streak protected");
      setActiveDate(null);
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to save");
    }
  };

  const handleMarkMissed = (dateStr) => {
    setActiveDate(null);
    setPendingBreak(dateStr);
  };

  const submitBreak = async ({ category, note }) => {
    try {
      await logWorkout({
        date: pendingBreak,
        status: "missed",
        breakReason: { category, note },
      });
      toast("Streak reset — logged the reason. Tomorrow's a fresh start.", { icon: "🔄" });
      setPendingBreak(null);
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to save");
    }
  };

  const submitCompleted = async (exercisesDone) => {
    const previousStreak = useWorkoutStore.getState().streak?.currentStreak ?? 0;
    try {
      const { streak } = await logWorkout({ date: activeDate, status: "completed", exercisesDone });
      setActiveDate(null);

      const milestone = checkMilestone(previousStreak, streak.currentStreak);
      if (milestone) {
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        toast.success(`${milestone.emoji} ${milestone.label}! ${streak.currentStreak} days and counting.`, {
          duration: 5000,
        });
      } else {
        toast.success("Nice work — day logged!");
      }
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to save");
    }
  };

  return (
    <div className="rounded-stamp border border-pine/10 bg-white/60 p-4 dark:bg-dusk-card dark:border-paper/10">
      <div className="mb-4 flex items-center justify-between">
        <button onClick={() => setMonthCursor(subMonths(monthCursor, 1))}>
          <ChevronLeft className="text-pine dark:text-paper" />
        </button>
        <h2 className="font-display text-lg font-semibold text-pine dark:text-paper">
          {format(monthCursor, "MMMM yyyy")}
        </h2>
        <button onClick={() => setMonthCursor(addMonths(monthCursor, 1))}>
          <ChevronRight className="text-pine dark:text-paper" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-center">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="text-xs font-medium text-pine/50 dark:text-paper/40">
            {d}
          </div>
        ))}

        {Array.from({ length: getDay(days[0]) }).map((_, i) => (
          <div key={`b-${i}`} />
        ))}

        {days.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const log = logFor(dateStr);
          const isToday = dateStr === format(new Date(), "yyyy-MM-dd");
          const isFutureDay = isAfter(startOfDay(day), today);

          return (
            <button
              key={dateStr}
              disabled={isFutureDay}
              onClick={() => handleDayClick(day, dateStr)}
              className={`aspect-square rounded-stamp text-sm font-mono transition
                ${log ? statusStyles[log.status] : "bg-pine/5 text-pine/70 dark:bg-paper/5 dark:text-paper/50"}
                ${isToday ? "ring-2 ring-ember" : ""}
                ${isFutureDay ? "cursor-not-allowed opacity-30" : ""}`}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex gap-4 text-xs text-pine/60 dark:text-paper/50">
        <span className="flex items-center gap-1"><Check size={12} /> Completed</span>
        <span className="flex items-center gap-1"><Coffee size={12} /> Rest</span>
        <span className="flex items-center gap-1"><X size={12} /> Missed</span>
      </div>

      {activeDate && (
        <div className="fixed inset-0 z-30 flex items-end justify-center bg-ink/40 p-4 sm:items-center">
          <div className="w-full max-w-sm rounded-stamp bg-paper p-6 dark:bg-dusk-card">
            <h3 className="font-display text-lg font-semibold text-pine dark:text-paper">
              {activeDate}
            </h3>
            <p className="mt-1 mb-4 text-sm text-pine/60 dark:text-paper/50">
              What happened today?
            </p>
            <CheckInInline
              plans={plans}
              existingLog={logFor(activeDate)}
              onComplete={submitCompleted}
              onRest={() => handleMarkRest(activeDate)}
              onMissed={() => handleMarkMissed(activeDate)}
              onCancel={() => setActiveDate(null)}
            />
          </div>
        </div>
      )}

      {pendingBreak && (
        <BreakReasonModal
          date={pendingBreak}
          onCancel={() => setPendingBreak(null)}
          onSubmit={submitBreak}
        />
      )}

      {viewDate && (
        <DayDetailModal
          dateStr={viewDate}
          log={logFor(viewDate)}
          onClose={() => setViewDate(null)}
          onEdit={() => {
            setViewDate(null);
            setActiveDate(viewDate);
          }}
        />
      )}
    </div>
  );
}

// Inline chooser: completed / rest / missed. Completed expands into a reps form.
function CheckInInline({ plans, existingLog, onComplete, onRest, onMissed, onCancel }) {
  const [showRepsForm, setShowRepsForm] = useState(existingLog?.status === "completed");
  const existingReps = Object.fromEntries(
    (existingLog?.exercisesDone || []).map((e) => [e.name, e.reps])
  );
  const [reps, setReps] = useState(
    Object.fromEntries(
      plans.map((p) => [p.exerciseName, existingReps[p.exerciseName] ?? p.targetReps])
    )
  );

  if (showRepsForm) {
    return (
      <div className="space-y-3">
        {plans.length === 0 && (
          <p className="text-sm text-pine/60 dark:text-paper/50">
            No plan yet — add exercises in the Planner tab. Logging as completed anyway.
          </p>
        )}
        {plans.map((p) => (
          <div key={p.exerciseName} className="flex items-center justify-between gap-3">
            <label className="text-sm capitalize text-pine dark:text-paper">
              {p.exerciseName}
            </label>
            <input
              type="number"
              value={reps[p.exerciseName]}
              onChange={(e) => setReps({ ...reps, [p.exerciseName]: e.target.value })}
              className="w-20 rounded-stamp border border-pine/20 bg-transparent px-2 py-1 text-right font-mono text-sm dark:border-paper/20"
            />
          </div>
        ))}
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={() => setShowRepsForm(false)} className="px-3 py-2 text-sm text-pine/50 dark:text-paper/40">
            Back
          </button>
          <button
            onClick={() =>
              onComplete(Object.entries(reps).map(([name, value]) => ({ name, reps: Number(value) })))
            }
            className="rounded-stamp bg-ember px-4 py-2 text-sm font-medium text-paper"
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2">
      <button
        onClick={() => setShowRepsForm(true)}
        className="rounded-stamp bg-pine px-4 py-3 text-sm font-medium text-paper"
      >
        ✅ Completed workout
      </button>
      <button
        onClick={onRest}
        className="rounded-stamp bg-moss/40 px-4 py-3 text-sm font-medium text-pine dark:text-paper"
      >
        ☕ Planned rest day
      </button>
      <button
        onClick={onMissed}
        className="rounded-stamp bg-clay/20 px-4 py-3 text-sm font-medium text-clay"
      >
        ❌ Missed it
      </button>
      <button onClick={onCancel} className="mt-1 text-sm text-pine/50 dark:text-paper/40">
        Cancel
      </button>
    </div>
  );
}
