import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getExerciseProgressApi, getMonthlySummaryApi } from "../api/statsApi";

const LINE_COLORS = ["#D9782D", "#1F3D36", "#7C9A82", "#B5482F"];

export default function AnalyticsPage() {
  const [progress, setProgress] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getExerciseProgressApi(), getMonthlySummaryApi(6)])
      .then(([p, m]) => {
        setProgress(p.data);
        setMonthly(m.data);
      })
      .finally(() => setLoading(false));
  }, []);

  // Pivot flat [{date, name, reps}] into [{date, squats: 70, pushups: 60}, ...] for the chart
  const { chartData, exerciseNames } = useMemo(() => {
    const names = [...new Set(progress.map((p) => p.name))];
    const byDate = {};
    for (const p of progress) {
      if (!byDate[p.date]) byDate[p.date] = { date: p.date };
      byDate[p.date][p.name] = p.reps;
    }
    return {
      chartData: Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date)),
      exerciseNames: names,
    };
  }, [progress]);

  const totalCompleted = monthly.reduce((sum, m) => sum + m.completed, 0);
  const totalMissed = monthly.reduce((sum, m) => sum + m.missed, 0);
  const consistencyRate =
    totalCompleted + totalMissed > 0
      ? Math.round((totalCompleted / (totalCompleted + totalMissed)) * 100)
      : 0;

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 pb-24 sm:pb-8">
      <h1 className="font-display text-2xl font-bold text-pine dark:text-paper">Analytics</h1>

      {loading && <p className="text-sm text-pine/60 dark:text-paper/50">Loading your data...</p>}

      {!loading && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-stamp border border-pine/10 bg-white/60 p-4 dark:bg-dusk-card dark:border-paper/10">
              <div className="font-mono text-2xl font-semibold text-ember">{consistencyRate}%</div>
              <div className="text-xs uppercase tracking-wide text-pine/60 dark:text-paper/50">
                Consistency rate (6 mo)
              </div>
            </div>
            <div className="rounded-stamp border border-pine/10 bg-white/60 p-4 dark:bg-dusk-card dark:border-paper/10">
              <div className="font-mono text-2xl font-semibold text-pine dark:text-paper">
                {totalCompleted}
              </div>
              <div className="text-xs uppercase tracking-wide text-pine/60 dark:text-paper/50">
                Workouts completed (6 mo)
              </div>
            </div>
          </div>

          <div className="rounded-stamp border border-pine/10 bg-white/60 p-4 dark:bg-dusk-card dark:border-paper/10">
            <h3 className="mb-3 font-display font-semibold text-pine dark:text-paper">
              Reps progression
            </h3>
            {chartData.length === 0 ? (
              <p className="text-sm text-pine/60 dark:text-paper/50">
                Log a few completed workouts to see your progression here.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F3D3620" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Legend />
                  {exerciseNames.map((name, i) => (
                    <Line
                      key={name}
                      type="monotone"
                      dataKey={name}
                      stroke={LINE_COLORS[i % LINE_COLORS.length]}
                      strokeWidth={2}
                      dot={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="rounded-stamp border border-pine/10 bg-white/60 p-4 dark:bg-dusk-card dark:border-paper/10">
            <h3 className="mb-3 font-display font-semibold text-pine dark:text-paper">
              Monthly consistency
            </h3>
            {monthly.length === 0 ? (
              <p className="text-sm text-pine/60 dark:text-paper/50">No history yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={monthly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F3D3620" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" stackId="a" fill="#1F3D36" />
                  <Bar dataKey="rest" stackId="a" fill="#7C9A82" />
                  <Bar dataKey="missed" stackId="a" fill="#B5482F" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </>
      )}
    </div>
  );
}
