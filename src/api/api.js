// src/api/api.js
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export async function apiFetch(path, options = {}) {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  // อ่าน body แบบปลอดภัย
  const raw = await res.text();
  let data = null;
  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    data = raw; // ถ้าไม่ใช่ json ให้เก็บเป็น text
  }

  if (!res.ok) {
    const msg =
      (data && data.message) ||
      (typeof data === "string" ? data : "") ||
      `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data;
}
