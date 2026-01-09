import { fetchProject } from "../api/project.js";
import { setProject, setProjectId, getProject } from "../state.js";
import { renderProjectInfo } from "../ui/renderProjectInfo.js";
import { fetchProjectMembers } from "../api/members.js";
import { parseJsonWebToken } from "../../login/utils/jsonWebToken.js";

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
      
      // Fetch and update member count and role
      try {
        const members = await fetchProjectMembers(projectId);
        document.getElementById("projectMemberCount").textContent = members.length || 0;
        
        // Find current user's role in the project
        const token = localStorage.getItem("accessToken");
        const storedUsername = localStorage.getItem("username");
        let currentUsername = storedUsername;
        if (token) {
          const decoded = parseJsonWebToken(token);
          currentUsername = decoded?.username || decoded?.sub || storedUsername;
        }
        
        if (currentUsername && Array.isArray(members)) {
          const currentUserMember = members.find(m => m.username === currentUsername);
          if (currentUserMember && currentUserMember.role) {
            // Capitalize first letter for display
            const role = currentUserMember.role.charAt(0).toUpperCase() + currentUserMember.role.slice(1);
            document.getElementById("projectRole").textContent = role;
          }
        }
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
