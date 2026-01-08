const state = {
  currentProjectId: null,
  currentPage: 1,
  projectsPerPage: 6,
  allProjects: [],
  filteredProjects: [],
};

export function getState() {
  return state;
}

export function setProjects(projects) {
  state.allProjects = projects;
  state.filteredProjects = projects;
}

export function getAllProjects() {
  return state.allProjects;
}

export function getFilteredProjects() {
  return state.filteredProjects;
}

export function setFilteredProjects(projects) {
  state.filteredProjects = projects;
}

export function getCurrentPage() {
  return state.currentPage;
}

export function setCurrentPage(page) {
  state.currentPage = page;
}

export function getProjectsPerPage() {
  return state.projectsPerPage;
}

export function setCurrentProjectId(id) {
  state.currentProjectId = id;
}

export function getCurrentProjectId() {
  return state.currentProjectId;
}
