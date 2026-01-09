import { getProjectId } from "../state.js";
import { validateGeoJSON } from "../utils/geojson.js";
import { addTraceToProject } from "../api/traces.js";
import { fetchProject } from "../api/project.js";
import { setProject } from "../state.js";
import { renderProjectInfo } from "../ui/renderProjectInfo.js";

export function initTraceUpload() {
  document.getElementById("uploadAllBtn")?.addEventListener("click", async () => {
    const entries = document.querySelectorAll(".trace-entry");
    const uploadStatus = document.getElementById("uploadStatus");

    uploadStatus.style.color = "black";
    uploadStatus.innerHTML = "Uploading...<br>";

    const projectId = getProjectId();
    if (!projectId) {
      uploadStatus.innerHTML = `<span style="color:red;">Geen project geselecteerd. Upload mislukt.</span>`;
      return;
    }

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const name = entry.querySelector(".trace-name")?.value.trim();
      const desc = entry.querySelector(".trace-desc")?.value.trim();
      const fileInput = entry.querySelector(".trace-geojson");

      if (!name) {
        uploadStatus.innerHTML += `<span style="color:red;">Entry ${i + 1}: Name is required</span><br>`;
        continue;
      }
      if (!fileInput?.files?.length) {
        uploadStatus.innerHTML += `<span style="color:red;">Entry ${i + 1}: No file selected</span><br>`;
        continue;
      }

      const file = fileInput.files[0];

      let geometry;
      try {
        geometry = JSON.parse(await file.text());
      } catch {
        uploadStatus.innerHTML += `<span style="color:red;">${file.name}: Invalid JSON</span><br>`;
        continue;
      }

      const validationError = validateGeoJSON(geometry);
      if (validationError) {
        uploadStatus.innerHTML += `<span style="color:red;">${file.name}: ${validationError}</span><br>`;
        continue;
      }

      const body = { name, description: desc, geometry };

      try {
        const result = await addTraceToProject(projectId, body);
        uploadStatus.innerHTML += `<span style="color:green;">${file.name}: Uploaded (ID: ${result.trace_id})</span><br>`;
      } catch (err) {
        uploadStatus.innerHTML += `<span style="color:red;">${file.name}: ${err.message}</span><br>`;
      }
    }

    // Refresh project data after successful uploads
    try {
      const projectData = await fetchProject(projectId);
      setProject(projectData);
      renderProjectInfo();
    } catch (err) {
      console.error("Failed to refresh project data:", err);
    }
  });
}
