const BASE = import.meta.env.VITE_API_URL.replace(/\/$/, ""); 

export async function api(endpoint, options = {}) {
  endpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  const response = await fetch(`${BASE}${endpoint}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include",
    body: options.body || null,
  });

  let data = {};
  try {
    data = await response.json();
  } catch {}

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}
