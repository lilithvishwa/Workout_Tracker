import ExercisePlanForm from "../components/planner/ExercisePlanForm";

export default function PlannerPage() {
  return (
    <div className="mx-auto max-w-lg p-4 pb-24 sm:pb-8">
      <h1 className="mb-4 font-display text-2xl font-bold text-pine dark:text-paper">
        Planner
      </h1>
      <ExercisePlanForm />
    </div>
  );
}
