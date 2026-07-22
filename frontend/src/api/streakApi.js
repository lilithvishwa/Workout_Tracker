import axiosClient from "./axiosClient";

export const getStreakApi = () => axiosClient.get("/streak");
export const getStreakHistoryApi = () => axiosClient.get("/streak/history");
export const recomputeStreakApi = () => axiosClient.post("/streak/recompute");
