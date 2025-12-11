// -------------------------
// Variables
// -------------------------
let currentProjectId = null;
let currentProjectName = "";
let allProjects = []; // original projects list
let filteredProjects = []; // filtered list for display

// -------------------------
// Fetch Projects
// -------------------------
async function fetchProjects() {
  const projectsContainer = document.getElementById("projectsContainer");
  const spinnerWrapper = document.getElementById("loadingSpinnerWrapper");

  // Show the loading overlay
  spinnerWrapper.style.display = "flex";
  projectsContainer.innerHTML = "";

  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      projectsContainer.innerHTML = `<p class="text-danger">Niet ingelogd.</p>`;
      return;
    }

    const response = await fetch(`https://sue-fastapi.onrender.com/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch projects");

    const projects = await response.json();
    allProjects = projects;
    filteredProjects = projects;

    // Show filters
    document.getElementById("projectFilters").style.display = "flex";

    // Render
    renderProjects(filteredProjects);

  } catch (err) {
    console.error(err);
    projectsContainer.innerHTML = `<p class="text-danger">Error bij het laden van de projecten. Controleer uw login.</p>`;
  } finally {
    // Hide the loading overlay
    spinnerWrapper.style.display = "none";
  }
}


// -------------------------
// Render Projects
// -------------------------
function renderProjects(projects) {
  const container = document.getElementById("projectsContainer");
  container.innerHTML = "";

  const role = localStorage.getItem("role"); // "admin" or "user"

  projects.forEach((project) => {
    const card = document.createElement("div");
    card.classList.add("project-card", "card");
    const dateStr = project.created_at
      ? new Date(project.created_at).toLocaleDateString("nl-NL")
      : "Onbekend";

    let uploadButtonHTML = "";
    if (role === "admin") {
      uploadButtonHTML = `
        <button class="btn btn-primary mb-2 create-trace-btn" data-project-id="${project.id}">
          Upload Trace
        </button>
      `;
    }

    card.innerHTML = `
      <div class="card-body">
        <h5 class="card-title text-center">${project.project_name.replaceAll("_", " ")}</h5>
        <p><strong>Aangemaakt op:</strong> ${dateStr}</p>
        <p><strong>Aantal Traces:</strong> ${project.traces.length}</p>
        ${uploadButtonHTML}
        <button class="btn btn-secondary mb-2 download-trace-btn" data-project-id="${project.id}">
          Download Traces
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}


// -------------------------
// Apply Filters
// -------------------------
function applyFilters() {
  let projects = [...allProjects];

  // Search filter
  const searchValue = document
    .getElementById("searchInput")
    .value.toLowerCase()
    .replaceAll(" ", "_");
  if (searchValue) {
    projects = projects.filter((p) =>
      p.project_name.toLowerCase().includes(searchValue)
    );
  }

  // Date range filter
  const dateFromEl = document.getElementById("dateFrom");
  const dateToEl = document.getElementById("dateTo");

  if (dateFromEl?.value) {
    const fromDate = new Date(dateFromEl.value);
    projects = projects.filter(
      (p) => p.created_at && new Date(p.created_at) >= fromDate
    );
  }
  if (dateToEl?.value) {
    const toDate = new Date(dateToEl.value);
    projects = projects.filter(
      (p) => p.created_at && new Date(p.created_at) <= toDate
    );
  }

  // Sorting
  const sort = document.getElementById("sortSelect").value;
  if (sort === "nameAsc")
    projects.sort((a, b) => a.project_name.localeCompare(b.project_name));
  else if (sort === "nameDesc")
    projects.sort((a, b) => b.project_name.localeCompare(a.project_name));
  else if (sort === "dateNewest")
    projects.sort(
      (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
    );
  else if (sort === "dateOldest")
    projects.sort(
      (a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0)
    );

  filteredProjects = projects;
  renderProjects(filteredProjects);
}

// -------------------------
// Filter Event Listeners
// -------------------------
document.getElementById("searchInput").addEventListener("input", applyFilters);
document.getElementById("sortSelect").addEventListener("change", applyFilters);
document.getElementById("dateFrom")?.addEventListener("change", applyFilters);
document.getElementById("dateTo")?.addEventListener("change", applyFilters);

// -------------------------
// Load projects automatically on page load
// -------------------------
document.addEventListener("DOMContentLoaded", () => {
  fetchProjects(); // Load projects if user is logged in
});

// -------------------------
// Rest of your modal / trace upload logic remains unchanged
// -------------------------

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
        `https://sue-fastapi.onrender.com/projects/${currentProjectId}/traces`,
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
