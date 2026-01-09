import { getProject } from "../state.js";
import { openTraceModal } from "../ui/traceModal.js";
import { openFeatureModal } from "../ui/featureModal.js";
import { openDownloadModal } from "../ui/downloadModal.js";
import { openAddMemberModal } from "../ui/addMemberModal.js";
import { showMembersPopup } from "./initMembers.js";
import { getProjectId } from "../state.js";

// Helper function to check if user can upload (only global admin)
// Global admins always have upload permissions, regardless of project role
function canUpload() {
  const globalRole = localStorage.getItem("role"); // "admin" or "user"
  
  // If global admin, always allow
  if (globalRole === "admin") {
    return true;
  }
  
  // For non-admins, check if API returned "admin" role (shouldn't happen, but be safe)
  const project = getProject();
  if (project && project.role === "admin") {
    return true;
  }
  
  return false;
}

// Update button visibility based on permissions
export function updateButtonVisibility() {
  const uploadTraceBtn = document.getElementById("uploadTraceBtn");
  const uploadFeatureBtn = document.getElementById("uploadFeatureBtn");
  
  if (uploadTraceBtn) {
    uploadTraceBtn.style.display = canUpload() ? "inline-block" : "none";
  }
  
  if (uploadFeatureBtn) {
    uploadFeatureBtn.style.display = canUpload() ? "inline-block" : "none";
  }
}

export function initActions() {
  // View members button
  document.querySelector(".view-members-btn")?.addEventListener("click", async () => {
    await showMembersPopup();
  });

  // Add member button
  document.querySelector(".add-member-btn")?.addEventListener("click", () => {
    openAddMemberModal();
  });

  // Upload Trace button (only for global admin)
  const uploadTraceBtn = document.getElementById("uploadTraceBtn");
  if (uploadTraceBtn) {
    uploadTraceBtn.addEventListener("click", () => {
      const project = getProject();
      if (project) {
        const projectData = project.project || project;
        openTraceModal(projectData.project_name?.replaceAll("_", " ") || "Project");
      }
    });
    // Initially hide, will be shown after project loads
    uploadTraceBtn.style.display = "none";
  }

  // Upload Feature button (only for global admin)
  const uploadFeatureBtn = document.getElementById("uploadFeatureBtn");
  if (uploadFeatureBtn) {
    uploadFeatureBtn.addEventListener("click", () => {
      const project = getProject();
      if (project) {
        const projectData = project.project || project;
        openFeatureModal(projectData);
      }
    });
    // Initially hide, will be shown after project loads
    uploadFeatureBtn.style.display = "none";
  }
  
  // Update visibility immediately in case project is already loaded
  updateButtonVisibility();

  // Download Traces button
  document.getElementById("downloadTracesBtn")?.addEventListener("click", () => {
    const project = getProject();
    if (project) {
      openDownloadModal(project);
    }
  });

  // View Project button (opens viewer)
  document.getElementById("viewProjectBtn")?.addEventListener("click", () => {
    const projectId = getProjectId();
    if (projectId) {
      window.open(`./viewer.html?project_id=${projectId}`, "_blank");
    }
  });

  // Back to overview button
  document.getElementById("backToOverviewBtn")?.addEventListener("click", () => {
    window.location.href = "./projecten-overview.html";
  });
}
