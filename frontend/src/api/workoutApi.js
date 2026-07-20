import axiosClient from "./axiosClient";

export const upsertWorkoutLogApi = (data) => axiosClient.post("/workouts", data);
export const getMonthLogsApi = (month) => axiosClient.get(`/workouts?month=${month}`);
export const getDayLogApi = (date) => axiosClient.get(`/workouts/${date}`);
