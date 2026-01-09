import { getProjectId } from "../state.js";
import { validateGeoJSON } from "../utils/geojson.js";
import { addFeaturesToProject } from "../api/features.js";
import { fetchProject } from "../api/project.js";
import { setProject } from "../state.js";
import { renderProjectInfo } from "../ui/renderProjectInfo.js";

export function initFeatureUpload() {
  document.getElementById("uploadAllFeaturesBtn")?.addEventListener("click", async () => {
    const entries = document.querySelectorAll(".feature-entry");
    const statusEl = document.getElementById("featureUploadStatus");

    statusEl.style.color = "black";
    statusEl.innerHTML = "Uploading...<br>";

    const projectId = getProjectId();
    const token = localStorage.getItem("accessToken");
    if (!token || !projectId) {
      statusEl.innerHTML = `<span style="color:red;">Geen project geselecteerd of niet ingelogd.</span>`;
      return;
    }

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const name = entry.querySelector(".feature-name")?.value.trim();
      const desc = entry.querySelector(".feature-desc")?.value.trim();
      const fileInput = entry.querySelector(".feature-geojson");

      if (!name) {
        statusEl.innerHTML += `<span style="color:red;">Entry ${i + 1}: Name is required</span><br>`;
        continue;
      }
      if (!fileInput?.files?.length) {
        statusEl.innerHTML += `<span style="color:red;">Entry ${i + 1}: No file selected</span><br>`;
        continue;
      }

      const file = fileInput.files[0];

      let geojson;
      try {
        geojson = JSON.parse(await file.text());
      } catch {
        statusEl.innerHTML += `<span style="color:red;">${file.name}: Invalid JSON</span><br>`;
        continue;
      }

      const validationError = validateGeoJSON(geojson);
      if (validationError) {
        statusEl.innerHTML += `<span style="color:red;">${file.name}: ${validationError}</span><br>`;
        continue;
      }

      const body = { name, description: desc, geojson };

      try {
        const result = await addFeaturesToProject(projectId, body);
        statusEl.innerHTML += `<span style="color:green;">${file.name}: Uploaded (ID: ${result.feature_id})</span><br>`;
      } catch (err) {
        statusEl.innerHTML += `<span style="color:red;">${file.name}: ${err.message}</span><br>`;
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
