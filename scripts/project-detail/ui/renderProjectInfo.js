import { getProject } from "../state.js";

export function renderProjectInfo() {
  const project = getProject();
  if (!project) return;

  // Handle API response structure: { project: {...}, traces: [...], features: [...] }
  const projectData = project.project || project;
  const traces = project.traces || [];
  const features = project.features || [];

  // Update header
  const header = document.getElementById("projectNameHeader");
  if (header) {
    header.textContent = projectData.project_name?.replaceAll("_", " ") || "Project";
  }

  // Update project info
  document.getElementById("projectNameInfo").textContent = projectData.project_name?.replaceAll("_", " ") || "Onbekend";
  
  const dateStr = projectData.created_at
    ? new Date(projectData.created_at).toLocaleDateString("nl-NL")
    : "Onbekend";
  document.getElementById("projectCreatedAt").textContent = dateStr;
  
  // Role is at root level, not in projectData
  // IMPORTANT: Always display "admin" for global admins, regardless of project-specific role
  const globalRole = localStorage.getItem("role"); // "admin" or "user"
  let role = project.role || "Onbekend";
  
  // Override: If user is global admin, always show "admin" (not "owner" or "collaborator")
  if (globalRole === "admin") {
    role = "admin";
  }
  
  // Capitalize first letter for display
  const displayRole = role !== "Onbekend" 
    ? role.charAt(0).toUpperCase() + role.slice(1)
    : role;
  document.getElementById("projectRole").textContent = displayRole;
  document.getElementById("projectTraceCount").textContent = traces.length || 0;
}
