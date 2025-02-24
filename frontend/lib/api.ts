// frontend/lib/api.ts
import axios from "axios";

// Get the API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL: API_URL,
});

// Log the API URL for debugging purposes during development
if (import.meta.env.DEV) {
  console.log("API URL:", API_URL);
}