import { useEffect, useMemo, useState } from "react";
import {
  AreaChart,
  Area,
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
import axiosClient, { getErrorMessage } from "../api/axiosClient";
import ContributionHeatmap from "../components/analytics/ContributionHeatmap";
import CountUp from "../components/analytics/CountUp";

const LINE_COLORS = ["#D9782D", "#1F3D36", "#7C9A82", "#B5482F"];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-stamp border border-pine/10 bg-paper/95 p-3 text-xs shadow-lg dark:bg-dusk-card dark:border-paper/10">
      <p className="mb-1 font-mono font-medium text-pine dark:text-paper">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: <span className="font-mono">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

function SkeletonBlock({ className }) {
  return <div className={`animate-pulse rounded-stamp bg-pine/10 dark:bg-paper/10 ${className}`} />;
}

export default function AnalyticsPage() {
  const [progress, setProgress] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [heatmapLogs, setHeatmapLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const year = new Date().getFullYear();

  const load = () => {
    setLoading(true);
    setError(null);
    Promise.all([
      getExerciseProgressApi(),
      getMonthlySummaryApi(6),
      axiosClient.get(`/stats/heatmap?year=${year}`),
    ])
      .then(([p, m, h]) => {
        setProgress(p.data);
        setMonthly(m.data);
        setHeatmapLogs(h.data);
      })
      .catch((err) => setError(getErrorMessage(err, "Couldn't load analytics")))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

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

      {error && (
        <div className="rounded-stamp bg-clay/10 p-3 text-sm text-clay">
          {error} <button onClick={load} className="underline">Retry</button>
        </div>
      )}

      {loading && !error && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <SkeletonBlock className="h-20" />
            <SkeletonBlock className="h-20" />
          </div>
          <SkeletonBlock className="h-64" />
          <SkeletonBlock className="h-40" />
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-stamp border border-pine/10 bg-white/60 p-4 dark:bg-dusk-card dark:border-paper/10">
              <div className="font-mono text-2xl font-semibold text-ember">
                <CountUp value={consistencyRate} suffix="%" />
              </div>
              <div className="text-xs uppercase tracking-wide text-pine/60 dark:text-paper/50">
                Consistency rate (6 mo)
              </div>
            </div>
            <div className="rounded-stamp border border-pine/10 bg-white/60 p-4 dark:bg-dusk-card dark:border-paper/10">
              <div className="font-mono text-2xl font-semibold text-pine dark:text-paper">
                <CountUp value={totalCompleted} />
              </div>
              <div className="text-xs uppercase tracking-wide text-pine/60 dark:text-paper/50">
                Workouts completed (6 mo)
              </div>
            </div>
          </div>

          <div className="rounded-stamp border border-pine/10 bg-white/60 p-4 dark:bg-dusk-card dark:border-paper/10">
            <h3 className="mb-1 font-display font-semibold text-pine dark:text-paper">
              {year} at a glance
            </h3>
            <p className="mb-3 text-xs text-pine/50 dark:text-paper/40">
              Every day you've logged this year, like a trail logbook.
            </p>
            {heatmapLogs.length === 0 ? (
              <p className="text-sm text-pine/60 dark:text-paper/50">No logs yet this year.</p>
            ) : (
              <ContributionHeatmap year={year} logs={heatmapLogs} />
            )}
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
                <AreaChart data={chartData}>
                  <defs>
                    {exerciseNames.map((name, i) => (
                      <linearGradient key={name} id={`grad-${name}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={LINE_COLORS[i % LINE_COLORS.length]} stopOpacity={0.35} />
                        <stop offset="95%" stopColor={LINE_COLORS[i % LINE_COLORS.length]} stopOpacity={0} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F3D3615" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={{ stroke: "#1F3D3620" }} />
                  <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  {exerciseNames.map((name, i) => (
                    <Area
                      key={name}
                      type="monotone"
                      dataKey={name}
                      stroke={LINE_COLORS[i % LINE_COLORS.length]}
                      strokeWidth={2.5}
                      fill={`url(#grad-${name})`}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  ))}
                </AreaChart>
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
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F3D3615" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} tickLine={false} axisLine={{ stroke: "#1F3D3620" }} />
                  <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="completed" stackId="a" fill="#1F3D36" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="rest" stackId="a" fill="#7C9A82" />
                  <Bar dataKey="missed" stackId="a" fill="#B5482F" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </>
      )}
    </div>
  );
}
