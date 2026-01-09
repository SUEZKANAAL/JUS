import { parseJsonWebToken } from "../../login/utils/jsonWebToken.js";

export function initCurrentUser() {
  const el = document.getElementById("currentUser");
  if (!el) return; // optional on some pages

  const token = localStorage.getItem("accessToken");
  const storedUsername = localStorage.getItem("username");

  // Try token first (if it contains username/sub), otherwise fallback to stored value
  let username = storedUsername;
  if (token) {
    const decoded = parseJsonWebToken(token);
    username = decoded?.username || decoded?.sub || storedUsername;
  }

  if (username) {
    el.textContent = `${username}`;
  } else {
    el.textContent = "";
  }
}
