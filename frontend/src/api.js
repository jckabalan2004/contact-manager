// Use environment variable if set, otherwise fall back to /api (local dev proxy) or full production URL
const getBaseURL = () => {
  // In production, use the full backend URL from env
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // In local dev, use the proxy path
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return "/api";
  }
  
  // In production without env var, use the Railway backend URL (without /api suffix, will be added by endpoint)
  return "https://contact-manager-production-a16a.up.railway.app";
};

const BASE_URL = getBaseURL();

export async function api(endpoint, options = {}) {
  const config = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include",
    body: options.body || null,
  };

  // Ensure endpoint starts with /api for non-localhost environments
  const path = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" 
    ? endpoint 
    : `/api${endpoint}`;
  
  const url = BASE_URL + path;
  console.log("[API]", config.method, url);
  
  const response = await fetch(url, config);

  let data;
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}
