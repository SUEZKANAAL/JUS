import { fetchProject } from "../api/project.js";
import { setProject, setProjectId, getProject } from "../state.js";
import { renderProjectInfo } from "../ui/renderProjectInfo.js";
import { fetchProjectMembers } from "../api/members.js";
import { parseJsonWebToken } from "../../login/utils/jsonWebToken.js";
import { updateButtonVisibility } from "./initActions.js";

export function initProjectLoader() {
  async function load() {
    const projectInfoSection = document.getElementById("projectInfoSection");
    const errorSection = document.getElementById("errorSection");
    const spinnerWrapper = document.getElementById("loadingSpinnerWrapper");

    // Get project ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get("project_id");

    if (!projectId) {
      spinnerWrapper.style.display = "none";
      errorSection.style.display = "block";
      document.getElementById("errorMessage").textContent = "Geen project ID opgegeven in de URL.";
      return;
    }

    setProjectId(projectId);
    spinnerWrapper.style.display = "flex";
    projectInfoSection.style.display = "none";
    errorSection.style.display = "none";

    try {
      const projectData = await fetchProject(projectId);
      setProject(projectData);
      
      renderProjectInfo();
      
      // Update button visibility based on project role
      updateButtonVisibility();
      
      // Fetch and update member count (role is already set by renderProjectInfo from API response)
      try {
        const members = await fetchProjectMembers(projectId);
        document.getElementById("projectMemberCount").textContent = members.length || 0;
      } catch (err) {
        console.error("Failed to fetch members count:", err);
        document.getElementById("projectMemberCount").textContent = "?";
      }

      projectInfoSection.style.display = "block";
    } catch (err) {
      console.error(err);
      errorSection.style.display = "block";
      document.getElementById("errorMessage").textContent = err.message || "Fout bij het laden van het project.";
    } finally {
      spinnerWrapper.style.display = "none";
    }
  }

  load();
}
