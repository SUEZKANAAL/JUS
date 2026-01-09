import { getProject } from "../state.js";
import { openTraceModal } from "../ui/traceModal.js";
import { openFeatureModal } from "../ui/featureModal.js";
import { openDownloadModal } from "../ui/downloadModal.js";
import { openAddMemberModal } from "../ui/addMemberModal.js";
import { showMembersPopup } from "./initMembers.js";
import { getProjectId } from "../state.js";

export function initActions() {
  const role = localStorage.getItem("role"); // "admin" or "user"

  // View members button
  document.querySelector(".view-members-btn")?.addEventListener("click", async () => {
    await showMembersPopup();
  });

  // Add member button
  document.querySelector(".add-member-btn")?.addEventListener("click", () => {
    openAddMemberModal();
  });

  // Upload Trace button (only for admin)
  const uploadTraceBtn = document.getElementById("uploadTraceBtn");
  if (uploadTraceBtn) {
    if (role === "admin") {
      uploadTraceBtn.style.display = "inline-block";
      uploadTraceBtn.addEventListener("click", () => {
        const project = getProject();
        if (project) {
          const projectData = project.project || project;
          openTraceModal(projectData.project_name?.replaceAll("_", " ") || "Project");
        }
      });
    } else {
      uploadTraceBtn.style.display = "none";
    }
  }

  // Upload Feature button (only for admin)
  const uploadFeatureBtn = document.getElementById("uploadFeatureBtn");
  if (uploadFeatureBtn) {
    if (role === "admin") {
      uploadFeatureBtn.style.display = "inline-block";
      uploadFeatureBtn.addEventListener("click", () => {
        const project = getProject();
        if (project) {
          const projectData = project.project || project;
          openFeatureModal(projectData);
        }
      });
    } else {
      uploadFeatureBtn.style.display = "none";
    }
  }

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
      window.open(`/pages/viewer.html?project_id=${projectId}`, "_blank");
    }
  });

  // Back to overview button
  document.getElementById("backToOverviewBtn")?.addEventListener("click", () => {
    window.location.href = "/pages/projecten-overview.html";
  });
}
