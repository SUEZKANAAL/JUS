import { createStandaloneProjectWithTrace } from "../api/standaloneProject.js";
import {
  openCreateProjectModal,
  closeCreateProjectModal,
  setCreateProjectStatus,
  clearCreateProjectStatus,
} from "../ui/createProjectModal.js";

export function initStandaloneProjectModal() {
  // Open modal
  document.getElementById("createStandaloneProjectBtn")?.addEventListener("click", () => {
    openCreateProjectModal();
  });

  // Close modal (X)
  document.getElementById("closeCreateProjectModal")?.addEventListener("click", () => {
    closeCreateProjectModal();
  });

  // Submit
  document.getElementById("createProjectWithTraceBtn")?.addEventListener("click", async () => {
    setCreateProjectStatus("Creating project...", "black");

    const projectName = document.getElementById("newProjectName")?.value.trim();
    const traceName = document.getElementById("newTraceName")?.value.trim();
    const traceDesc = document.getElementById("newTraceDesc")?.value.trim();
    const fileInput = document.getElementById("newTraceFile");

    if (!projectName || !traceName || !fileInput?.files?.length) {
      setCreateProjectStatus("Project name, trace name, and GeoJSON file are required.", "red");
      return;
    }

    let geojson;
    try {
      geojson = JSON.parse(await fileInput.files[0].text());
    } catch {
      setCreateProjectStatus("Invalid GeoJSON file.", "red");
      return;
    }

    const body = {
      projectName,
      trace: {
        name: traceName,
        description: traceDesc,
        geometry: geojson,
      },
    };

    try {
      const result = await createStandaloneProjectWithTrace(body);

      setCreateProjectStatus(
        `Project created! Project ID: ${result.project_id}, Trace ID: ${result.trace_id}`,
        "green"
      );

      setTimeout(() => {
        closeCreateProjectModal();
        clearCreateProjectStatus();
        // optionally refresh projects later
      }, 1500);
    } catch (err) {
      setCreateProjectStatus(err.message || "Er is iets misgegaan", "red");
    }
  });
}
