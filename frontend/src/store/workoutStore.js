import { create } from "zustand";
import { getMonthLogsApi, upsertWorkoutLogApi } from "../api/workoutApi";
import { getStreakApi } from "../api/streakApi";

export const useWorkoutStore = create((set, get) => ({
  monthLogs: [], // logs for the currently viewed month
  streak: null,
  loading: false,

  fetchMonthLogs: async (month) => {
    set({ loading: true });
    try {
      const { data } = await getMonthLogsApi(month);
      set({ monthLogs: data, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  fetchStreak: async () => {
    const { data } = await getStreakApi();
    set({ streak: data });
    return data;
  },

  logWorkout: async (payload) => {
    const { data } = await upsertWorkoutLogApi(payload);
    // refresh local state so the calendar + streak cards update immediately
    set((state) => {
      const filtered = state.monthLogs.filter((l) => l.date !== data.log.date);
      return { monthLogs: [...filtered, data.log], streak: data.streak };
    });
    return data;
  },
}));
