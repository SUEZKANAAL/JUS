import { 
  setSearch, 
  setDateFrom, 
  setDateTo, 
  setSort, 
  setCurrentPage 
} from "../state.js";
import { loadProjects } from "./initProjectsLoader.js";

// Map frontend sort values to backend sort values
function mapSortValue(frontendSort) {
  const mapping = {
    "nameAsc": "name_asc",
    "nameDesc": "name_desc",
    "dateNewest": "date_newest",
    "dateOldest": "date_oldest",
  };
  return mapping[frontendSort] || "date_newest";
}

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function initFilters() {
  function applyFilters() {
    // Get filter values from DOM
    const searchInput = document.getElementById("searchInput");
    const dateFromEl = document.getElementById("dateFrom");
    const dateToEl = document.getElementById("dateTo");
    const sortSelect = document.getElementById("sortSelect");

    // Update state with new filter values
    setSearch(searchInput?.value || "");
    setDateFrom(dateFromEl?.value || "");
    setDateTo(dateToEl?.value || "");
    
    // Map frontend sort to backend sort
    const frontendSort = sortSelect?.value || "dateNewest";
    const backendSort = mapSortValue(frontendSort);
    setSort(backendSort);

    // Reset to first page when filters change
    setCurrentPage(1);

    // Reload projects with new filters
    loadProjects();
  }

  // Debounced version for search input (300ms delay)
  const debouncedApplyFilters = debounce(applyFilters, 300);

  // Search input: use debounced version
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", debouncedApplyFilters);
  }

  // Other filters: apply immediately
  const sortSelect = document.getElementById("sortSelect");
  if (sortSelect) {
    sortSelect.addEventListener("change", applyFilters);
  }

  const dateFromEl = document.getElementById("dateFrom");
  if (dateFromEl) {
    dateFromEl.addEventListener("change", applyFilters);
  }

  const dateToEl = document.getElementById("dateTo");
  if (dateToEl) {
    dateToEl.addEventListener("change", applyFilters);
  }
}
