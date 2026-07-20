import axios from "axios";
import { useAuthStore } from "../store/authStore";

// Set VITE_API_URL in a .env file at the frontend root for production deploys.
const baseURL = import.meta.env.VITE_API_URL;

const axiosClient = axios.create({ baseURL });

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

export default axiosClient;
