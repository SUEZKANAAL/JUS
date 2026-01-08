// -------------------------
// Variables
// -------------------------
let currentProjectId = null;
let currentProjectName = "";
let allProjects = []; // original projects list


// -------------------------
// Render Projects
// -------------------------
const addMemberModal = new bootstrap.Modal(
  document.getElementById("addMemberModal")
);


window.__projectsOverviewServices = {
  fetchMembersCount,
  showMembersPopup,

  openAddMemberModal() {
    document.getElementById("newMemberUsername").value = "";
    addMemberModal.show();
  },

  openTraceModal(project) {
    document.getElementById("traceModalProjectName").innerText = `Project: ${project.project_name}`;
    document.getElementById("traceModal").style.display = "flex";
  },

  openFeatureModal(project) {
    document.getElementById("featureModalProjectName").innerText = `Project: ${project.project_name}`;
    document.getElementById("featureModal").style.display = "flex";
  },
};


// Get the amount of members in the group
async function fetchMembersCount(projectId) {
  const token = localStorage.getItem("accessToken");
  try {
    const response = await fetch(
      `https://sue-fastapi.onrender.com/projects/${projectId}/members`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!response.ok) throw new Error("Failed to fetch members");

    const members = await response.json();
    const countSpan = document.getElementById(`member-count-${projectId}`);
    if (countSpan) countSpan.textContent = `(${members.length})`;
  } catch (err) {
    console.error(err);
  }
}

// Show members in modal
async function showMembersPopup(projectId) {
  const token = localStorage.getItem("accessToken");
  try {
    const response = await fetch(
      `https://sue-fastapi.onrender.com/projects/${projectId}/members`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!response.ok) throw new Error("Failed to fetch members");

    const members = await response.json();
    const membersList = document.getElementById("membersList");
    membersList.innerHTML = members
      .map((m) => `<li class="list-group-item">${m.username} (${m.role})</li>`)
      .join("");

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById("membersModal"));
    modal.show();
  } catch (err) {
    console.error(err);
    alert("Failed to fetch members");
  }
}

// add members
document
  .getElementById("confirmAddMemberBtn")
  .addEventListener("click", async () => {
    const username = document.getElementById("newMemberUsername").value.trim();
    if (!username) return alert("Voer een username in!");

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `https://sue-fastapi.onrender.com/projects/${currentProjectId}/add-user`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: username, role: "collaborator" }),
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.detail || "Kon gebruiker niet toevoegen");

      alert(`Gebruiker ${username} succesvol toegevoegd!`);
      addMemberModal.hide();

      // refresh members count
      fetchMembersCount(currentProjectId);
    } catch (err) {
      console.error(err);
      alert(err.message || "Er is iets misgegaan");
    }
  });


// // -------------------------
// // Load projects automatically on page load
// // -------------------------
// document.addEventListener("DOMContentLoaded", () => {
//   fetchProjects(); // Load projects if user is logged in
// });


// -------------------------
// Open Trace Modal (Event Delegation)
// -------------------------
document.getElementById("projectsContainer").addEventListener("click", (e) => {
  const btn = e.target.closest(".create-trace-btn");
  if (!btn) return;

  currentProjectId = btn.getAttribute("data-project-id");

  // Find selected project from allProjects
  const project = allProjects.find((p) => p.id == currentProjectId);
  const projectName = project
    ? project.project_name.replaceAll("_", " ")
    : "Onbekend";

  // Show modal
  const modal = document.getElementById("traceModal");
  modal.style.display = "flex";

  // Update project name in modal
  const projectNameEl = document.getElementById("traceModalProjectName");
  if (projectNameEl) projectNameEl.innerText = `Project: ${projectName}`;

  // Clear previous entries and start fresh
  document.getElementById("traceEntriesContainer").innerHTML = "";
  addTraceEntry();
});

// -------------------------
// Close Modal
// -------------------------
document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("traceModal").style.display = "none";
  document.getElementById("traceEntriesContainer").innerHTML = "";
  document.getElementById("uploadStatus").innerText = "";
});

// -------------------------
// Open Download Modal
// -------------------------
document.getElementById("projectsContainer").addEventListener("click", (e) => {
  const btn = e.target.closest(".download-trace-btn");
  if (!btn) return;

  const projectId = btn.getAttribute("data-project-id");
  const project = allProjects.find((p) => p.id == projectId);
  if (!project) return;

  const modal = document.getElementById("downloadModal");
  modal.style.display = "flex";

  document.getElementById(
    "downloadModalProjectName"
  ).innerText = `Project: ${project.project_name.replaceAll("_", " ")}`;

  const traceListEl = document.getElementById("downloadTraceList");
  traceListEl.innerHTML = "";

  if (project.traces.length === 0) {
    traceListEl.innerHTML = "<p>Geen traces beschikbaar.</p>";
    return;
  }

  project.traces.forEach((trace) => {
    const div = document.createElement("div");
    div.style.display = "flex";
    div.style.justifyContent = "space-between";
    div.style.marginBottom = "5px";

    div.innerHTML = `
            <span>${trace.name}</span>
            <button class="btn btn-sm btn-outline-primary">Download</button>
        `;

    // Download GeoJSON on click
    div.querySelector("button").addEventListener("click", () => {
      const featureCollection = {
        type: "FeatureCollection",
        crs: {
          type: "name",
          properties: { name: "EPSG:28992" }, // adjust if needed
        },
        features: [
          {
            type: "Feature",
            id: trace.id || 1,
            geometry: trace.geometry,
            properties: {
              name: trace.name,
              description: trace.description || "",
            },
          },
        ],
      };

      const blob = new Blob([JSON.stringify(featureCollection, null, 2)], {
        type: "application/geo+json",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${trace.name.replaceAll(" ", "_")}.geojson`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    });

    traceListEl.appendChild(div);
  });
});

// Close download modal
document.getElementById("closeDownloadModal").addEventListener("click", () => {
  document.getElementById("downloadModal").style.display = "none";
});

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

// -------------------------
// Add Trace Entry
// -------------------------
function addTraceEntry() {
  const container = document.getElementById("traceEntriesContainer");
  const div = document.createElement("div");
  div.classList.add("trace-entry");
  div.style.border = "1px solid #ccc";
  div.style.padding = "10px";
  div.style.marginBottom = "10px";
  div.innerHTML = `
        <div>
            <label>Trace Naam:</label>
            <input type="text" class="trace-name form-control" required/>
        </div>
        <div>
            <label>Omschrijving:</label>
            <textarea class="trace-desc form-control" required></textarea>
        </div>
        <div>
            <label>GeoJSON Bestand:</label>
            <input type="file" class="trace-geojson" accept=".json,.geojson" required/>
        </div>
        <button type="button" class="btn btn-danger btn-sm remove-trace-entry mt-2">Remove</button>
    `;
  container.appendChild(div);

  div
    .querySelector(".remove-trace-entry")
    .addEventListener("click", () => div.remove());
}

document
  .getElementById("addTraceEntryBtn")
  .addEventListener("click", addTraceEntry);

// -------------------------
// Upload All Traces
// -------------------------
document.getElementById("uploadAllBtn").addEventListener("click", async () => {
  const entries = document.querySelectorAll(".trace-entry");
  const uploadStatus = document.getElementById("uploadStatus");
  uploadStatus.style.color = "black";
  uploadStatus.innerHTML = "Uploading...<br>";

  const token = localStorage.getItem("accessToken");
  if (!token) {
    uploadStatus.innerHTML = `<span style="color:red;">Niet ingelogd. Upload mislukt.</span>`;
    return;
  }

  if (!currentProjectId) {
    uploadStatus.innerHTML = `<span style="color:red;">Geen project geselecteerd. Upload mislukt.</span>`;
    return;
  }

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const name = entry.querySelector(".trace-name").value.trim();
    const desc = entry.querySelector(".trace-desc").value.trim();
    const fileInput = entry.querySelector(".trace-geojson");

    if (!name) {
      uploadStatus.innerHTML += `<span style="color:red;">Entry ${
        i + 1
      }: Name is required</span><br>`;
      continue;
    }
    if (!fileInput.files.length) {
      uploadStatus.innerHTML += `<span style="color:red;">Entry ${
        i + 1
      }: No file selected</span><br>`;
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
      const response = await fetch(
        `https://sue-fastapi.onrender.com/projects/${currentProjectId}/add-trace`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Failed to upload trace");
      }

      const result = await response.json();
      uploadStatus.innerHTML += `<span style="color:green;">${file.name}: Uploaded (ID: ${result.trace_id})</span><br>`;
    } catch (err) {
      uploadStatus.innerHTML += `<span style="color:red;">${file.name}: ${err.message}</span><br>`;
    }
  }
});




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
  if (!token || !currentProjectId) {
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
      const response = await fetch(`https://sue-fastapi.onrender.com/projects/${currentProjectId}/add-features`, {
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
// Create standalone project modal
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







