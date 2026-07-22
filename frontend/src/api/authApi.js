import axiosClient from "./axiosClient";

export const registerApi = (data) => axiosClient.post("/auth/register", data);
export const loginApi = (data) => axiosClient.post("/auth/login", data);
export const getProfileApi = () => axiosClient.get("/auth/me");
export const updateReminderSettingsApi = (data) =>
  axiosClient.put("/auth/reminder-settings", data);
export const forgotPasswordApi = (email) => axiosClient.post("/auth/forgot-password", { email });
export const resetPasswordApi = (token, password) =>
  axiosClient.post(`/auth/reset-password/${token}`, { password });
