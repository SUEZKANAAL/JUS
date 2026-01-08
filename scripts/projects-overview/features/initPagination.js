import { renderProjects } from "../ui/renderProjects.js";


import {
  getFilteredProjects,
  getProjectsPerPage,
  getCurrentPage,
  setCurrentPage,
} from "../state.js";

export function initPagination() {


  document.getElementById("firstPageBtn")?.addEventListener("click", () => {
    setCurrentPage(1);
    renderProjects(getFilteredProjects());
  });

  document.getElementById("prevPageBtn")?.addEventListener("click", () => {
    setCurrentPage(getCurrentPage() - 1);
    renderProjects(getFilteredProjects());
  });

  document.getElementById("nextPageBtn")?.addEventListener("click", () => {
    setCurrentPage(getCurrentPage() + 1);
    renderProjects(getFilteredProjects());
  });

  document.getElementById("lastPageBtn")?.addEventListener("click", () => {
    const projects = getFilteredProjects();
    const perPage = getProjectsPerPage();
    setCurrentPage(Math.ceil(projects.length / perPage));
    renderProjects(projects);
  });
}
