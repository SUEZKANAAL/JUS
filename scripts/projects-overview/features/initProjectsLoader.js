import { fetchProjects } from "../api/projects.js";
import { setProjects, getFilteredProjects } from "../state.js";
import { renderProjects } from "../ui/renderProjects.js";

export function initProjectsLoader() {
  async function load() {
    const projectsContainer = document.getElementById("projectsContainer");
    const spinnerWrapper = document.getElementById("loadingSpinnerWrapper");

    spinnerWrapper.style.display = "flex";
    projectsContainer.innerHTML = "";

    try {
      const projects = await fetchProjects();

      setProjects(projects);
      document.getElementById("projectFilters").style.display = "flex";
      renderProjects(getFilteredProjects());
    } catch (err) {
      console.error(err);
      projectsContainer.innerHTML = `<p class="text-danger">Error bij het laden van de projecten.</p>`;
    } finally {
      spinnerWrapper.style.display = "none";
    }
  }

  load();
}
