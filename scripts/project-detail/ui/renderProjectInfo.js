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
  
  document.getElementById("projectRole").textContent = projectData.role || "Onbekend";
  document.getElementById("projectTraceCount").textContent = traces.length || 0;
}
