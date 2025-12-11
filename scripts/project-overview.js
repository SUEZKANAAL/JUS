document
  .getElementById("loadProjectsBtn")
  .addEventListener("click", async () => {
    const apiKey = document.getElementById("apiKeyInput").value.trim();
    if (!apiKey) {
      alert("Please enter your API key!");
      return;
    }

    const projectsContainer = document.getElementById("projectsContainer");
    projectsContainer.innerHTML = ""; // clear previous

    try {
      // Fetch all projects
      const response = await fetch(
        `https://sue-fastapi.onrender.com/projects`,
        {
          headers: { "x-api-key": apiKey },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch projects");
      const projects = await response.json(); // array of projects
      document.getElementById("projectFilters").style.display = "flex";

      projects.forEach((project) => {
        // Create card without map
        const card = document.createElement("div");
        card.classList.add("project-card", "card");
        card.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title text-center">${project.project_name}</h5>
                    <p><strong>Traces:</strong> ${project.traces.length}</p>
                    <button class="btn btn-primary mb-4 create-trace-btn" data-project-id="${project.id}">Upload Trace</button>
                </div>
            `;
        projectsContainer.appendChild(card);
      });
    } catch (err) {
      console.error(err);
      projectsContainer.innerHTML = `<p class="text-danger">Error bij het laden van de projecten. Verifieer uw API key</p>`;
    }
  });

let currentProjectId = null;

// Filter projects
let allProjects = [];       // store original list
let filteredProjects = [];  // list that is shown

function renderProjects(projects) {
    const container = document.getElementById("projectsContainer");
    container.innerHTML = "";

    projects.forEach(p => {
        const card = document.createElement("div");
        card.classList.add("project-card");
        card.innerHTML = `
            <h4>${p.name}</h4>
            <p>${p.description}</p>
            <small>${new Date(p.created_at).toLocaleDateString()}</small>
        `;
        container.appendChild(card);
    });
}

function applyFilters() {
    let projects = [...allProjects];

    // 🔍 Search filter
    const searchValue = document.getElementById("searchInput").value.toLowerCase();
    if (searchValue) {
        projects = projects.filter(p =>
            p.name.toLowerCase().includes(searchValue) ||
            (p.description && p.description.toLowerCase().includes(searchValue))
        );
    }

    // 📅 Date range filter
    const from = document.getElementById("dateFrom").value;
    const to   = document.getElementById("dateTo").value;

    if (from) {
        projects = projects.filter(p => new Date(p.created_at) >= new Date(from));
    }
    if (to) {
        projects = projects.filter(p => new Date(p.created_at) <= new Date(to));
    }

    // 🔡 Sorting
    const sort = document.getElementById("sortSelect").value;

    if (sort === "nameAsc") {
        projects.sort((a,b) => a.name.localeCompare(b.name));
    } 
    else if (sort === "nameDesc") {
        projects.sort((a,b) => b.name.localeCompare(a.name));
    } 
    else if (sort === "dateNewest") {
        projects.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
    } 
    else if (sort === "dateOldest") {
        projects.sort((a,b) => new Date(a.created_at) - new Date(b.created_at));
    }

    filteredProjects = projects;
    renderProjects(filteredProjects);
}

// 🔄 Live hooks
document.getElementById("searchInput").addEventListener("input", applyFilters);
document.getElementById("sortSelect").addEventListener("change", applyFilters);
document.getElementById("dateFrom").addEventListener("change", applyFilters);
document.getElementById("dateTo").addEventListener("change", applyFilters);


// Open modal
document.getElementById("projectsContainer").addEventListener("click", (e) => {
  if (e.target.classList.contains("create-trace-btn")) {
    currentProjectId = e.target.getAttribute("data-project-id");
    document.getElementById("traceModal").style.display = "flex";
    document.getElementById("traceEntriesContainer").innerHTML = "";
    addTraceEntry(); // start with one entry
  }
});

// Close modal
document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("traceModal").style.display = "none";
  document.getElementById("traceEntriesContainer").innerHTML = "";
  document.getElementById("uploadStatus").innerText = "";
});

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
    if (!feature.type || feature.type !== "Feature") {
      return `Feature at index ${i} is missing type 'Feature'.`;
    }
    if (
      !feature.geometry ||
      !feature.geometry.type ||
      !Array.isArray(feature.geometry.coordinates)
    ) {
      return `Feature at index ${i} has invalid geometry.`;
    }

    const validGeometryTypes = [
      "Point",
      "MultiPoint",
      "LineString",
      "MultiLineString",
      "Polygon",
      "MultiPolygon",
    ];
    if (!validGeometryTypes.includes(feature.geometry.type)) {
      return `Feature at index ${i} has unsupported geometry type '${feature.geometry.type}'.`;
    }
  }

  return null; // valid
}

// Add a new trace entry
function addTraceEntry() {
  const container = document.getElementById("traceEntriesContainer");
  const div = document.createElement("div");
  div.classList.add("trace-entry");
  div.style.border = "1px solid #ccc";
  div.style.padding = "10px";
  div.style.marginBottom = "10px";
  div.innerHTML = `
        <div>
            <label>Name:</label>
            <input type="text" class="trace-name form-control" required/>
        </div>
        <div>
            <label>Description:</label>
            <textarea class="trace-desc form-control" required></textarea>
        </div>
        <div>
            <label>GeoJSON File:</label>
            <input type="file" class="trace-geojson" accept=".json,.geojson" required/>
        </div>
        <button type="button" class="btn btn-danger btn-sm remove-trace-entry mt-2">Remove</button>
    `;
  container.appendChild(div);

  div.querySelector(".remove-trace-entry").addEventListener("click", () => {
    div.remove();
  });
}

// Add entry button
document
  .getElementById("addTraceEntryBtn")
  .addEventListener("click", addTraceEntry);

// Upload all traces
document.getElementById("uploadAllBtn").addEventListener("click", async () => {
  const entries = document.querySelectorAll(".trace-entry");
  const apiKey = document.getElementById("apiKeyInput").value.trim();
  const uploadStatus = document.getElementById("uploadStatus");
  uploadStatus.style.color = "black";
  uploadStatus.innerHTML = "Uploading...<br>";

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
      const text = await file.text();
      geometry = JSON.parse(text);
    } catch (err) {
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
          headers: { "Content-Type": "application/json", "x-api-key": apiKey },
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

  // // Optionally close modal after all uploads
  // setTimeout(() => {
  //     document.getElementById("traceModal").style.display = "none";
  //     document.getElementById("traceEntriesContainer").innerHTML = "";
  //     uploadStatus.innerHTML = "";
  // }, 3000);
});
