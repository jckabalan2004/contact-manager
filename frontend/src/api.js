const BASE_URL = import.meta.env.VITE_API_URL;

export async function api(endpoint, options = {}) {
  const config = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include", // always include cookies
    body: options.body || null,
  };

  const url = `${BASE_URL}${endpoint}`;

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
