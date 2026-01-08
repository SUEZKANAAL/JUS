import { getAllProjects, setFilteredProjects, setCurrentPage } from "../state.js";
import { renderProjects } from "../ui/renderProjects.js";



export function initFilters() {
  function applyFilters() {
    let projects = [...getAllProjects()];

    // Search filter
    const searchValue = document
      .getElementById("searchInput")
      .value.toLowerCase()
      .replaceAll(" ", "_");

    if (searchValue) {
      projects = projects.filter((p) =>
        p.project_name.toLowerCase().includes(searchValue)
      );
    }

    // Date range filter
    const dateFromEl = document.getElementById("dateFrom");
    const dateToEl = document.getElementById("dateTo");

    if (dateFromEl?.value) {
      const fromDate = new Date(dateFromEl.value);
      projects = projects.filter(
        (p) => p.created_at && new Date(p.created_at) >= fromDate
      );
    }

    if (dateToEl?.value) {
      const toDate = new Date(dateToEl.value);
      projects = projects.filter(
        (p) => p.created_at && new Date(p.created_at) <= toDate
      );
    }

    // Sorting
    const sort = document.getElementById("sortSelect").value;
    if (sort === "nameAsc")
      projects.sort((a, b) => a.project_name.localeCompare(b.project_name));
    else if (sort === "nameDesc")
      projects.sort((a, b) => b.project_name.localeCompare(a.project_name));
    else if (sort === "dateNewest")
      projects.sort(
        (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
      );
    else if (sort === "dateOldest")
      projects.sort(
        (a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0)
      );

    // Update filteredProjects (legacy state)
    setFilteredProjects(projects);

    // Reset to first page
    setCurrentPage(1);

    // Render
    renderProjects(projects);
  }

  document.getElementById("searchInput")?.addEventListener("input", applyFilters);
  document.getElementById("sortSelect")?.addEventListener("change", applyFilters);
  document.getElementById("dateFrom")?.addEventListener("change", applyFilters);
  document.getElementById("dateTo")?.addEventListener("change", applyFilters);
}
