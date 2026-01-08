export function initPagination() {
  const deps = window.__projectsOverviewDeps;
  if (!deps) throw new Error("Missing window.__projectsOverviewDeps");

  document.getElementById("firstPageBtn")?.addEventListener("click", () => {
    deps.setCurrentPage(1);
    window.renderProjects(deps.getFilteredProjects());
  });

  document.getElementById("prevPageBtn")?.addEventListener("click", () => {
    deps.setCurrentPage(deps.getCurrentPage() - 1);
    window.renderProjects(deps.getFilteredProjects());
  });

  document.getElementById("nextPageBtn")?.addEventListener("click", () => {
    deps.setCurrentPage(deps.getCurrentPage() + 1);
    window.renderProjects(deps.getFilteredProjects());
  });

  document.getElementById("lastPageBtn")?.addEventListener("click", () => {
    const projects = deps.getFilteredProjects();
    const perPage = deps.getProjectsPerPage();
    deps.setCurrentPage(Math.ceil(projects.length / perPage));
    window.renderProjects(projects);
  });
}
