import { useEffect, useState } from "react";
import { useWorkoutStore } from "../store/workoutStore";
import { useAuthStore } from "../store/authStore";
import { getErrorMessage } from "../api/axiosClient";
import StreakCard from "../components/dashboard/StreakCard";
import StatCards from "../components/dashboard/StatCards";
import MilestoneProgress from "../components/dashboard/MilestoneProgress";

export default function Dashboard() {
  const { streak, fetchStreak } = useWorkoutStore();
  const user = useAuthStore((s) => s.user);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStreak().catch((err) => setError(getErrorMessage(err, "Couldn't load your streak")));
  }, []);

  return (
    <div className="mx-auto max-w-lg space-y-5 p-4 pb-24 sm:pb-8">
      <h1 className="font-display text-2xl font-bold text-pine dark:text-paper">
        Hey {user?.name?.split(" ")[0]} 👋
      </h1>

      {error && (
        <div className="rounded-stamp bg-clay/10 p-3 text-sm text-clay">
          {error}{" "}
          <button
            onClick={() => {
              setError(null);
              fetchStreak().catch((err) => setError(getErrorMessage(err)));
            }}
            className="underline"
          >
            Retry
          </button>
        </div>
      )}

      <StreakCard streak={streak} />
      <MilestoneProgress currentStreak={streak?.currentStreak ?? 0} />
      <StatCards streak={streak} />

      {streak?.lastBreakReason?.category && (
        <div className="rounded-stamp border border-clay/20 bg-clay/10 p-4 text-sm text-clay">
          Last break: <span className="capitalize">{streak.lastBreakReason.category}</span>
          {streak.lastBreakReason.note && ` — "${streak.lastBreakReason.note}"`}
        </div>
      )}
    </div>
  );
}
