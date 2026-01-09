/**
 * API Toggle UI Module
 * Handles the display and interaction of the API toggle in the navbar
 * Only visible in development mode for security
 */

import { shouldShowToggle, getApiMode, setUseLocalAPI, getUseLocalAPI, getApiBaseUrl } from "./apiConfig.js";

/**
 * Updates the toggle badge display
 */
function updateToggleDisplay() {
  const container = document.getElementById("apiToggleContainer");
  const indicator = document.getElementById("apiToggleIndicator");
  const text = document.getElementById("apiToggleText");

  if (!container || !indicator || !text) return;

  const mode = getApiMode();
  const isLocal = mode === "Local";

  // Update indicator and text
  indicator.textContent = isLocal ? "🔴" : "🟢";
  text.textContent = mode;

  // Update title for tooltip
  container.title = `API: ${getApiBaseUrl()} (Click to toggle)`;
}

/**
 * Handles toggle click
 */
function handleToggleClick() {
  if (!shouldShowToggle()) {
    console.warn("API toggle is not available in production mode");
    return;
  }

  const currentUseLocal = getUseLocalAPI();
  const newUseLocal = !currentUseLocal;

  setUseLocalAPI(newUseLocal);
  updateToggleDisplay();

  // Show feedback
  const mode = newUseLocal ? "Local" : "Production";
  console.log(`🔄 Switched to ${mode} API (${getApiBaseUrl()})`);
  
  // Optional: Show a brief visual feedback
  const badge = document.getElementById("apiToggleBadge");
  if (badge) {
    badge.style.opacity = "0.6";
    setTimeout(() => {
      badge.style.opacity = "1";
    }, 200);
  }

  // Reload page to apply new API endpoint
  // You could also use a custom event to notify other parts of the app
  if (confirm(`Switched to ${mode} API. Reload page to apply changes?`)) {
    window.location.reload();
  }
}

/**
 * Initializes the API toggle in the navbar
 */
export function initApiToggle() {
  // Only show toggle in development mode
  if (!shouldShowToggle()) {
    return; // Toggle container is hidden by default (d-none class)
  }

  const container = document.getElementById("apiToggleContainer");
  const badge = document.getElementById("apiToggleBadge");

  if (!container || !badge) {
    console.warn("API toggle elements not found in navbar");
    return;
  }

  // Show the toggle
  container.classList.remove("d-none");

  // Set up click handler
  badge.addEventListener("click", handleToggleClick);

  // Initial display update
  updateToggleDisplay();

  console.log("✅ API toggle initialized (Development mode)");
}
