/**
 * Global API Config (for non-module scripts)
 * Exposes getApiBaseUrl() globally for legacy scripts
 */

(function() {
  'use strict';
  
  const PRODUCTION_API_URL = "https://sue-fastapi.onrender.com";
  const LOCAL_API_URL = "http://localhost:8000";
  const LOCAL_API_STORAGE_KEY = "useLocalAPI";

  function isDevelopmentMode() {
    const hostname = window.location.hostname;
    return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "";
  }

  function getApiBaseUrl() {
    // In production, always use production API (security)
    if (!isDevelopmentMode()) {
      return PRODUCTION_API_URL;
    }

    // In development, check user preference
    const useLocal = localStorage.getItem(LOCAL_API_STORAGE_KEY) === "true";
    return useLocal ? LOCAL_API_URL : PRODUCTION_API_URL;
  }

  // Expose globally
  window.getApiBaseUrl = getApiBaseUrl;
})();
