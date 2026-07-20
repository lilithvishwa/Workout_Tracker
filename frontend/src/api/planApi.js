import axiosClient from "./axiosClient";

export const createPlanApi = (data) => axiosClient.post("/plans", data);
export const getCurrentPlansApi = () => axiosClient.get("/plans/current");
export const getPlanHistoryApi = (exerciseName) =>
  axiosClient.get(`/plans/history${exerciseName ? `?exerciseName=${exerciseName}` : ""}`);
export const advancePlanApi = (id) => axiosClient.post(`/plans/${id}/advance`);
