import axios from "axios";
import { store } from "../store/store";

const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically intercept requests and attach the JWT token
apiClient.interceptors.request.use(
  (config) => {
    // Get the token directly from the Redux store
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default apiClient;
