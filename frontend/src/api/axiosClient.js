import axios from "axios";
import { useAuthStore } from "../store/authStore";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const axiosClient = axios.create({
  baseURL,
  timeout: 20000, // generous timeout — free-tier backends (Render) can take 30-50s to wake from sleep
});

axiosClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

// Produces a human-readable message from ANY axios error, distinguishing
// "server said no" (bad password) from "request never reached the server"
// (CORS misconfiguration, backend asleep/cold-starting, no internet).
// Previously the app silently fell back to a generic message for both cases,
// which made real CORS/network failures look like wrong-password errors.
export function getErrorMessage(error, fallback = "Something went wrong") {
  if (error.response?.data?.message) return error.response.data.message;
  if (error.code === "ECONNABORTED") {
    return "The server is taking a while to respond (it may be waking up from sleep). Please try again in a few seconds.";
  }
  if (error.message === "Network Error") {
    return "Couldn't reach the server. Check your internet connection, or the backend may be down.";
  }
  return fallback;
}

export default axiosClient;
