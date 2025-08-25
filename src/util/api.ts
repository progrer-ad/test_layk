// src/util/api.ts
import axios from "axios";

// Get API base URL from environment variable.
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://68ac5f519148d.xvest1.ru/api",
  withCredentials: true, // Important for sending and receiving cookies across origins (e.g., for Laravel Sanctum)
});

// Add a request interceptor to include the Authorization header (Bearer token)
// for authenticated requests.
api.interceptors.request.use((config) => {
  // Check if window is defined to ensure localStorage is available (client-side)
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    if (token) {
      // If a token exists, set the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config; // Return the modified config
}, (error) => {
  // Handle request errors
  return Promise.reject(error);
});

export default api;