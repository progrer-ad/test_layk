// src/util/api.ts
import axios from "axios";

// Get API base URL from environment variable.
// Ensure NEXT_PUBLIC_API_URL is set in your .env.local file (e.g., NEXT_PUBLIC_API_URL=http://localhost:8000/api)
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
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