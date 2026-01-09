const state = {
  currentProjectId: null,
  // Current page of projects (from backend)
  projects: [],
  // Pagination metadata
  currentPage: 1,
  projectsPerPage: 6,
  total: 0,
  totalPages: 0,
  // Filter values
  filters: {
    search: "",
    dateFrom: "",
    dateTo: "",
    sort: "date_newest", // default: newest first
  },
  // Loading state
  isLoading: false,
};

export function getState() {
  return state;
}

// Set projects and pagination metadata from API response
export function setProjectsData(data) {
  state.projects = data.projects || [];
  state.total = data.total || 0;
  state.currentPage = data.page || 1;
  state.projectsPerPage = data.per_page || 6;
  state.totalPages = data.total_pages || 0;
}

// Get current projects (for rendering)
export function getProjects() {
  return state.projects;
}

// Pagination getters/setters
export function getCurrentPage() {
  return state.currentPage;
}

export function setCurrentPage(page) {
  state.currentPage = page;
}

export function getProjectsPerPage() {
  return state.projectsPerPage;
}

export function getTotal() {
  return state.total;
}

export function getTotalPages() {
  return state.totalPages;
}

// Filter getters/setters
export function getFilters() {
  return { ...state.filters };
}

export function setFilters(filters) {
  state.filters = { ...state.filters, ...filters };
}

export function setSearch(search) {
  state.filters.search = search;
}

export function setDateFrom(dateFrom) {
  state.filters.dateFrom = dateFrom;
}

export function setDateTo(dateTo) {
  state.filters.dateTo = dateTo;
}

export function setSort(sort) {
  state.filters.sort = sort;
}

// Loading state
export function setIsLoading(loading) {
  state.isLoading = loading;
}

export function getIsLoading() {
  return state.isLoading;
}

// Legacy compatibility (for other parts of code that might use these)
export function getAllProjects() {
  return state.projects;
}

export function getFilteredProjects() {
  return state.projects;
}

// Project ID getters/setters
export function setCurrentProjectId(id) {
  state.currentProjectId = id;
}

export function getCurrentProjectId() {
  return state.currentProjectId;
}
