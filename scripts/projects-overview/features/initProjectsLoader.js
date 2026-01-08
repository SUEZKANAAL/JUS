export function initProjectsLoader() {
  async function fetchProjects() {
    const projectsContainer = document.getElementById("projectsContainer");
    const spinnerWrapper = document.getElementById("loadingSpinnerWrapper");

    // Show the loading overlay
    spinnerWrapper.style.display = "flex";
    projectsContainer.innerHTML = "";

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        projectsContainer.innerHTML = `<p class="text-danger">Niet ingelogd.</p>`;
        return;
      }

      const response = await fetch(`https://sue-fastapi.onrender.com/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch projects");

      const projects = await response.json();

      // Update old script state via the bridge
      window.__projectsOverviewBridge?.setProjects(projects);

      // Show filters
      document.getElementById("projectFilters").style.display = "flex";

      // Render using existing renderProjects from old script
      const filtered = window.__projectsOverviewBridge?.getFilteredProjects() ?? projects;
      window.renderProjects(filtered);
    } catch (err) {
      console.error(err);
      projectsContainer.innerHTML = `<p class="text-danger">Error bij het laden van de projecten. Controleer uw login.</p>`;
    } finally {
      // Hide the loading overlay
      spinnerWrapper.style.display = "none";
    }
  }

  fetchProjects();
}
