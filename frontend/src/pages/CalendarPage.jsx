import WorkoutCalendar from "../components/calendar/WorkoutCalendar";

export default function CalendarPage() {
  return (
    <div className="mx-auto max-w-lg p-4 pb-24 sm:pb-8">
      <h1 className="mb-4 font-display text-2xl font-bold text-pine dark:text-paper">
        Your log
      </h1>
      <WorkoutCalendar />
    </div>
  );
}
