// src/api.js
const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = async (path, options = {}) => {
  const url = `${API_BASE_URL}${path}`;

  const response = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "Request failed"
    }));
    throw error;
  }

  return response.json();
};
