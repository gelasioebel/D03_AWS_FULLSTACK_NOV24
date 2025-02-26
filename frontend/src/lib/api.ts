import axios from "axios";

// Create API instance with proper base URL configuration
// Using environment variable for API base URL if available, otherwise default to localhost
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL: apiBaseUrl,
});

// Add request interceptor for debugging
api.interceptors.request.use(
    (config) => {
      console.log(`API Request to: ${config.url}`, config);
      return config;
    },
    (error) => {
      console.error("API Request Error:", error);
      return Promise.reject(error);
    }
);

// Add response interceptor for debugging
api.interceptors.response.use(
    (response) => {
      console.log(`API Response from: ${response.config.url}`, response.data);
      return response;
    },
    (error) => {
      console.error("API Response Error:", error.response || error);
      return Promise.reject(error);
    }
);