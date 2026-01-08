// -------------------------
// Variables
// -------------------------
let currentProjectName = "";
let allProjects = []; // original projects list


// -------------------------
// Render Projects
// -------------------------
const addMemberModal = new bootstrap.Modal(
  document.getElementById("addMemberModal")
);


window.__projectsOverviewServices = {
  openAddMemberModal() {
    document.getElementById("newMemberUsername").value = "";
    addMemberModal.show();
  },



  openFeatureModal(project) {
    document.getElementById("featureModalProjectName").innerText = `Project: ${project.project_name}`;
    document.getElementById("featureModal").style.display = "flex";
  },
};



// // -------------------------
// // Load projects automatically on page load
// // -------------------------
// document.addEventListener("DOMContentLoaded", () => {
//   fetchProjects(); // Load projects if user is logged in
// });




// -------------------------
// Validate GeoJSON
// -------------------------
function validateGeoJSON(geojson) {
  if (
    !geojson ||
    geojson.type !== "FeatureCollection" ||
    !Array.isArray(geojson.features)
  ) {
    return "GeoJSON must be a FeatureCollection with a features array.";
  }
  for (let i = 0; i < geojson.features.length; i++) {
    const feature = geojson.features[i];
    if (!feature.type || feature.type !== "Feature")
      return `Feature at index ${i} missing type 'Feature'.`;
    if (
      !feature.geometry ||
      !feature.geometry.type ||
      !Array.isArray(feature.geometry.coordinates)
    ) {
      return `Feature at index ${i} has invalid geometry.`;
    }
    const validTypes = [
      "Point",
      "MultiPoint",
      "LineString",
      "MultiLineString",
      "Polygon",
      "MultiPolygon",
    ];
    if (!validTypes.includes(feature.geometry.type))
      return `Feature at index ${i} has unsupported type '${feature.geometry.type}'.`;
  }
  return null;
}



document
  .getElementById("addTraceEntryBtn")
  .addEventListener("click", window.__projectsOverviewAddTraceEntry?.());





// -------------------------
// Add Feature Entry
// -------------------------
function addFeatureEntry() {
  const container = document.getElementById("featureEntriesContainer");
  const div = document.createElement("div");
  div.classList.add("feature-entry");
  div.style.border = "1px solid #ccc";
  div.style.padding = "10px";
  div.style.marginBottom = "10px";
  div.innerHTML = `
    <div>
        <label>Feature Naam:</label>
        <input type="text" class="feature-name form-control" required/>
    </div>
    <div>
        <label>Omschrijving:</label>
        <textarea class="feature-desc form-control"></textarea>
    </div>
    <div>
        <label>GeoJSON Bestand:</label>
        <input type="file" class="feature-geojson" accept=".json,.geojson" required/>
    </div>
    <button type="button" class="btn btn-danger btn-sm remove-feature-entry mt-2">Remove</button>
  `;
  container.appendChild(div);

  div.querySelector(".remove-feature-entry").addEventListener("click", () => div.remove());
}

document.getElementById("addFeatureEntryBtn").addEventListener("click", addFeatureEntry);

// -------------------------
// Upload All Features
// -------------------------
document.getElementById("uploadAllFeaturesBtn").addEventListener("click", async () => {
  const entries = document.querySelectorAll(".feature-entry");
  const statusEl = document.getElementById("featureUploadStatus");
  statusEl.style.color = "black";
  statusEl.innerHTML = "Uploading...<br>";

  const token = localStorage.getItem("accessToken");
  const projectId = window.__projectsOverviewState.getCurrentProjectId();
  if (!token || !projectId) {
    statusEl.innerHTML = `<span style="color:red;">Geen project geselecteerd of niet ingelogd.</span>`;
    return;
  }

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const name = entry.querySelector(".feature-name").value.trim();
    const desc = entry.querySelector(".feature-desc").value.trim();
    const fileInput = entry.querySelector(".feature-geojson");

    if (!name) {
      statusEl.innerHTML += `<span style="color:red;">Entry ${i+1}: Name is required</span><br>`;
      continue;
    }
    if (!fileInput.files.length) {
      statusEl.innerHTML += `<span style="color:red;">Entry ${i+1}: No file selected</span><br>`;
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
      const response = await fetch(`https://sue-fastapi.onrender.com/projects/${projectId}/add-features`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Failed to upload feature");
      }

      const result = await response.json();
      statusEl.innerHTML += `<span style="color:green;">${file.name}: Uploaded (ID: ${result.feature_id})</span><br>`;
    } catch (err) {
      statusEl.innerHTML += `<span style="color:red;">${file.name}: ${err.message}</span><br>`;
    }
  }
});

// Close Feature Modal when "×" is clicked
const featureModal = document.getElementById("featureModal");
const closeFeatureBtn = document.getElementById("closeFeatureModal");

closeFeatureBtn.addEventListener("click", () => {
  featureModal.style.display = "none";
});

// Optional: close modal when clicking outside the modal content
window.addEventListener("click", (event) => {
  if (event.target === featureModal) {
    featureModal.style.display = "none";
  }
});

// -------------------------
// CREATE STANDALONE PROJECT MODAL
// -------------------------

// Show modal when clicking the "Create Standalone Project" button
document.getElementById("createStandaloneProjectBtn").addEventListener("click", () => {
  document.getElementById("createProjectModal").style.display = "flex";
});

// Close modal
document.getElementById("closeCreateProjectModal").addEventListener("click", () => {
  document.getElementById("createProjectModal").style.display = "none";
});

// Handle project + trace creation
document.getElementById("createProjectWithTraceBtn").addEventListener("click", async () => {
  const statusEl = document.getElementById("createProjectStatus");
  statusEl.style.color = "black";
  statusEl.innerHTML = "Creating project...";

  const projectName = document.getElementById("newProjectName").value.trim();
  const traceName = document.getElementById("newTraceName").value.trim();
  const traceDesc = document.getElementById("newTraceDesc").value.trim();
  const fileInput = document.getElementById("newTraceFile");

  if (!projectName || !traceName || !fileInput.files.length) {
    statusEl.style.color = "red";
    statusEl.innerHTML = "Project name, trace name, and GeoJSON file are required.";
    return;
  }

  let geojson;
  try {
    geojson = JSON.parse(await fileInput.files[0].text());
  } catch {
    statusEl.style.color = "red";
    statusEl.innerHTML = "Invalid GeoJSON file.";
    return;
  }

  const token = localStorage.getItem("accessToken");

  const body = {
    projectName,
    trace: {
      name: traceName,
      description: traceDesc,
      geometry: geojson
    }
  };

  try {
    const response = await fetch("https://sue-fastapi.onrender.com/create-project-standalone-with-trace", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.detail || "Failed to create project");
    }

    const result = await response.json();
    statusEl.style.color = "green";
    statusEl.innerHTML = `Project created! Project ID: ${result.project_id}, Trace ID: ${result.trace_id}`;

    // Close modal after success
    setTimeout(() => {
      document.getElementById("createProjectModal").style.display = "none";
      statusEl.innerHTML = "";
      // Optionally refresh projects list here
    }, 1500);

  } catch (err) {
    statusEl.style.color = "red";
    statusEl.innerHTML = err.message;
  }
});







