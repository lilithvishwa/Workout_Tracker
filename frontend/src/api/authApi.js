import axiosClient from "./axiosClient";

export const registerApi = (data) => axiosClient.post("/auth/register", data);
export const loginApi = (data) => axiosClient.post("/auth/login", data);
export const getProfileApi = () => axiosClient.get("/auth/me");
export const updateReminderSettingsApi = (data) =>
  axiosClient.put("/auth/reminder-settings", data);
