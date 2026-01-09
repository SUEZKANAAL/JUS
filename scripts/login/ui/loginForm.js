import { login } from "../api/auth.js";
import { parseJsonWebToken } from "../utils/jsonWebToken.js";

export function initLoginForm() {
  const usernameEl = document.getElementById("username");
  const passwordEl = document.getElementById("password");
  const loginBtn = document.getElementById("loginBtn");
  const errorDiv = document.getElementById("loginError");

  if (!usernameEl || !passwordEl || !loginBtn || !errorDiv) {
    throw new Error("Login form elements missing in login.html");
  }

  function setLoading(isLoading) {
    loginBtn.disabled = isLoading;
    usernameEl.disabled = isLoading;
    passwordEl.disabled = isLoading;

    loginBtn.innerText = isLoading ? "Logging in..." : "Login";
    // optional: bootstrap spinner
    if (isLoading) {
      loginBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Logging in...`;
    } else {
      loginBtn.textContent = "Login";
    }
  }

  function showError(msg) {
    errorDiv.textContent = msg;
    errorDiv.classList.remove("d-none");
  }

  function clearError() {
    errorDiv.classList.add("d-none");
    errorDiv.textContent = "";
  }

  async function handleLogin() {
    clearError();

    const username = usernameEl.value.trim();
    const password = passwordEl.value;

    if (!username || !password) {
      showError("Please enter your username and password.");
      return;
    }

    setLoading(true);

    try {
      const data = await login(username, password, { timeoutMs: 12000 });

      localStorage.setItem("accessToken", data.access_token);

      const decoded = parseJsonWebToken(data.access_token);
      if (decoded?.role) localStorage.setItem("role", decoded.role);

      // Optional: show quick success feedback
      loginBtn.textContent = "Success ✓";
      localStorage.setItem("username", username);

      window.location.href = "./projecten-overview.html";
    } catch (err) {
      showError(err?.message || "Login failed");
      setLoading(false);
    }
  }

  loginBtn.addEventListener("click", handleLogin);

  // Enter submits
  usernameEl.addEventListener("keydown", (e) => e.key === "Enter" && handleLogin());
  passwordEl.addEventListener("keydown", (e) => e.key === "Enter" && handleLogin());
}
