/**
 * API Configuration Module
 * 
 * Automatically detects environment and provides appropriate API base URL.
 * Toggle functionality is only available in development (localhost).
 */

// Configuration constants
const PRODUCTION_API_URL = "https://sue-fastapi.onrender.com";
const LOCAL_API_URL = "http://localhost:8000"; // Adjust port if needed
const LOCAL_API_STORAGE_KEY = "useLocalAPI";

/**
 * Checks if the current environment is development (localhost)
 * @returns {boolean} True if running on localhost
 */
export function isDevelopmentMode() {
  const hostname = window.location.hostname;
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "";
}

/**
 * Determines if the API toggle should be shown to the user
 * Only visible in development mode for security
 * @returns {boolean} True if toggle should be visible
 */
export function shouldShowToggle() {
  return isDevelopmentMode();
}

/**
 * Gets the API base URL based on environment and user preference
 * - Production: Always returns production URL (ignores localStorage)
 * - Development: Checks localStorage for user preference, defaults to local
 * @returns {string} The API base URL
 */
export function getApiBaseUrl() {
  // In production, always use production API (security)
  if (!isDevelopmentMode()) {
    return PRODUCTION_API_URL;
  }

  // In development, check user preference
  const useLocal = localStorage.getItem(LOCAL_API_STORAGE_KEY) === "true";
  return useLocal ? LOCAL_API_URL : PRODUCTION_API_URL;
}

/**
 * Sets the user's preference for local API (development only)
 * @param {boolean} useLocal - Whether to use local API
 */
export function setUseLocalAPI(useLocal) {
  if (!isDevelopmentMode()) {
    console.warn("Cannot set local API in production mode");
    return;
  }
  localStorage.setItem(LOCAL_API_STORAGE_KEY, useLocal ? "true" : "false");
}

/**
 * Gets the current preference for local API
 * @returns {boolean} True if using local API (only meaningful in dev mode)
 */
export function getUseLocalAPI() {
  if (!isDevelopmentMode()) {
    return false; // Always false in production
  }
  return localStorage.getItem(LOCAL_API_STORAGE_KEY) === "true";
}

/**
 * Gets the current API mode for display purposes
 * @returns {string} "Local" or "Production"
 */
export function getApiMode() {
  const baseUrl = getApiBaseUrl();
  return baseUrl === LOCAL_API_URL ? "Local" : "Production";
}

// Log current API configuration in development
if (isDevelopmentMode()) {
  console.log(`🔧 API Config: Using ${getApiMode()} API (${getApiBaseUrl()})`);
}
