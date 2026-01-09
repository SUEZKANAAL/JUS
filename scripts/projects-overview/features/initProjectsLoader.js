import { fetchProjects } from "../api/projects.js";
import { 
  setProjectsData, 
  getProjects, 
  getFilters, 
  setIsLoading,
  getCurrentPage,
  getProjectsPerPage
} from "../state.js";
import { renderProjects } from "../ui/renderProjects.js";

export async function loadProjects() {
  const projectsContainer = document.getElementById("projectsContainer");
  const spinnerWrapper = document.getElementById("loadingSpinnerWrapper");

  setIsLoading(true);
  if (spinnerWrapper) spinnerWrapper.style.display = "flex";
  if (projectsContainer) projectsContainer.innerHTML = "";

  try {
    const filters = getFilters();
    const currentPage = getCurrentPage();
    const perPage = getProjectsPerPage();

    const params = {
      page: currentPage,
      per_page: perPage,
      sort: filters.sort || "date_newest",
    };

    if (filters.search) params.search = filters.search;
    if (filters.dateFrom) params.date_from = filters.dateFrom;
    if (filters.dateTo) params.date_to = filters.dateTo;

    const data = await fetchProjects(params);
    setProjectsData(data);

    const projectFilters = document.getElementById("projectFilters");
    if (projectFilters) projectFilters.style.display = "flex";

    renderProjects();
  } catch (err) {
    console.error("Error loading projects:", err);
    if (projectsContainer) {
      projectsContainer.innerHTML = `<p class="text-danger">Error bij het laden van de projecten: ${err.message}</p>`;
    }
  } finally {
    setIsLoading(false);
    if (spinnerWrapper) spinnerWrapper.style.display = "none";
  }
}

export function initProjectsLoader() {
  loadProjects();
}
