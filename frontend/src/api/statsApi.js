import axiosClient from "./axiosClient";

export const getExerciseProgressApi = () => axiosClient.get("/stats/exercise-progress");
export const getMonthlySummaryApi = (months = 6) =>
  axiosClient.get(`/stats/monthly-summary?months=${months}`);
export const getDayDetailApi = (date) => axiosClient.get(`/stats/day/${date}`);
