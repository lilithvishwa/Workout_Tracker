import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createPlanApi, getCurrentPlansApi, advancePlanApi } from "../../api/planApi";
import { format } from "date-fns";

export default function ExercisePlanForm() {
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState({
    exerciseName: "",
    targetReps: "",
    incrementPerMonth: "10",
    effectiveFrom: format(new Date(), "yyyy-MM-dd"),
  });

  const loadPlans = () => getCurrentPlansApi().then((res) => setPlans(res.data));

  useEffect(() => {
    loadPlans();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPlanApi({
        ...form,
        targetReps: Number(form.targetReps),
        incrementPerMonth: Number(form.incrementPerMonth),
      });
      toast.success("Plan saved!");
      setForm({ ...form, exerciseName: "", targetReps: "" });
      loadPlans();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save plan");
    }
  };

  const handleAdvance = async (planId) => {
    try {
      await advancePlanApi(planId);
      toast.success("Next month's target created!");
      loadPlans();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to advance plan");
    }
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="space-y-3 rounded-stamp border border-pine/10 bg-white/60 p-5 dark:bg-dusk-card dark:border-paper/10"
      >
        <h3 className="font-display text-lg font-semibold text-pine dark:text-paper">
          Add an exercise target
        </h3>

        <input
          required
          placeholder="Exercise name (e.g. squats)"
          value={form.exerciseName}
          onChange={(e) => setForm({ ...form, exerciseName: e.target.value })}
          className="w-full rounded-stamp border border-pine/20 bg-transparent p-2 text-sm dark:border-paper/20"
        />

        <div className="flex gap-3">
          <input
            required
            type="number"
            placeholder="Starting reps (e.g. 70)"
            value={form.targetReps}
            onChange={(e) => setForm({ ...form, targetReps: e.target.value })}
            className="w-1/2 rounded-stamp border border-pine/20 bg-transparent p-2 text-sm dark:border-paper/20"
          />
          <input
            type="number"
            placeholder="+ per month (default 10)"
            value={form.incrementPerMonth}
            onChange={(e) => setForm({ ...form, incrementPerMonth: e.target.value })}
            className="w-1/2 rounded-stamp border border-pine/20 bg-transparent p-2 text-sm dark:border-paper/20"
          />
        </div>

        <input
          type="date"
          value={form.effectiveFrom}
          onChange={(e) => setForm({ ...form, effectiveFrom: e.target.value })}
          className="w-full rounded-stamp border border-pine/20 bg-transparent p-2 text-sm dark:border-paper/20"
        />

        <button type="submit" className="w-full rounded-stamp bg-ember px-4 py-2 text-sm font-medium text-paper">
          Save target
        </button>
      </form>

      <div>
        <h3 className="mb-2 font-display text-lg font-semibold text-pine dark:text-paper">
          Current targets
        </h3>
        <div className="space-y-2">
          {plans.length === 0 && (
            <p className="text-sm text-pine/60 dark:text-paper/50">No targets set yet.</p>
          )}
          {plans.map((p) => (
            <div
              key={p._id}
              className="flex items-center justify-between rounded-stamp border border-pine/10 bg-white/60 p-3 dark:bg-dusk-card dark:border-paper/10"
            >
              <div>
                <span className="capitalize font-medium text-pine dark:text-paper">
                  {p.exerciseName}
                </span>
                <span className="ml-2 font-mono text-sm text-pine/60 dark:text-paper/50">
                  {p.targetReps} reps (+{p.incrementPerMonth}/mo)
                </span>
              </div>
              <button
                onClick={() => handleAdvance(p._id)}
                className="rounded-stamp bg-pine px-3 py-1.5 text-xs font-medium text-paper"
              >
                Advance month
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
