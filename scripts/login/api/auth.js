// scripts/login/api/auth.js

export async function login(username, password, { timeoutMs = 12000 } = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch("https://sue-fastapi.onrender.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      signal: controller.signal,
    });

    if (!response.ok) {
      // Try to read backend error details (if any)
      let detail = "";
      try {
        const data = await response.json();
        detail = data?.detail || data?.message || "";
      } catch {
        // ignore
      }

      if (response.status === 401) throw new Error("Invalid username or password.");
      if (response.status >= 500) throw new Error("Server error. Please try again.");
      throw new Error(detail || `Login failed (HTTP ${response.status}).`);
    }

    return response.json();
  } catch (err) {
    if (err?.name === "AbortError") {
      throw new Error("Login is taking too long. Check your connection and try again.");
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}
