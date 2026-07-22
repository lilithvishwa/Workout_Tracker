import { useMemo } from "react";
import { eachDayOfInterval, format, startOfYear, endOfYear, getDay } from "date-fns";

const statusColor = {
  completed: "bg-pine",
  rest: "bg-moss/50",
  missed: "bg-clay/60",
  none: "bg-pine/10 dark:bg-paper/10",
};

export default function ContributionHeatmap({ year, logs }) {
  const logByDate = useMemo(() => {
    const map = {};
    for (const l of logs) map[l.date] = l.status;
    return map;
  }, [logs]);

  const days = useMemo(() => {
    const yearDate = new Date(year, 0, 1);
    return eachDayOfInterval({ start: startOfYear(yearDate), end: endOfYear(yearDate) });
  }, [year]);

  // Pad the front so the grid aligns to Sunday-start weeks
  const leadingBlanks = getDay(days[0]);
  const cells = [...Array(leadingBlanks).fill(null), ...days];

  return (
    <div className="overflow-x-auto">
      <div className="grid grid-flow-col grid-rows-7 gap-1" style={{ width: "max-content" }}>
        {cells.map((day, i) => {
          if (!day) return <div key={`b-${i}`} className="h-3 w-3" />;
          const dateStr = format(day, "yyyy-MM-dd");
          const status = logByDate[dateStr] || "none";
          return (
            <div
              key={dateStr}
              title={`${dateStr}: ${status}`}
              className={`h-3 w-3 rounded-sm ${statusColor[status]}`}
            />
          );
        })}
      </div>
      <div className="mt-2 flex items-center gap-3 text-xs text-pine/50 dark:text-paper/40">
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-sm bg-pine" /> Completed
        </span>
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-sm bg-moss/50" /> Rest
        </span>
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-sm bg-clay/60" /> Missed
        </span>
      </div>
    </div>
  );
}
