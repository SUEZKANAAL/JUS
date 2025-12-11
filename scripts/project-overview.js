document.getElementById("loadProjectsBtn").addEventListener("click", async () => {
    const apiKey = document.getElementById("apiKeyInput").value.trim();
    if (!apiKey) {
        alert("Please enter your API key!");
        return;
    }

    const projectsContainer = document.getElementById("projectsContainer");
    projectsContainer.innerHTML = ""; // clear previous

    try {
        // Fetch all projects
        const response = await fetch(`https://sue-fastapi.onrender.com/projects`, {
            headers: { "x-api-key": apiKey }
        });
        if (!response.ok) throw new Error("Failed to fetch projects");
        const projects = await response.json(); // array of projects

        projects.forEach((data) => {
            const card = document.createElement("div");
            card.classList.add("project-card", "card", "col-md-6", "mb-4");

            card.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title text-center">${data.project_name}</h5>
                    <div id="map-${data.id}" class="map" style="height:300px; margin-bottom: 10px;"></div>
                    <p><strong>Traces:</strong> ${data.traces.length}</p>
                    <button class="btn btn-success create-trace-btn" data-project-id="${data.id}">Create Trace</button>
                </div>
            `;

            projectsContainer.appendChild(card);

            // Initialize Leaflet map
            const map = L.map(`map-${data.id}`, {
                crs: L.CRS.EPSG28992, // RD projection
                center: [52.1, 5.1],   // default center
                zoom: 12
            });

            // RD base map
            L.tileLayer('https://geodata.nationaalgeoregister.nl/tiles/service/wmts/brtachtergrondkaart/EPSG:28992/{z}/{x}/{y}.png', {
                attribution: 'Kadaster & PDOK',
                maxZoom: 19,
                minZoom: 1
            }).addTo(map);

            // Add project area if available
            if (data.project_area) {
                const wkt = new Wkt.Wkt();
                wkt.read(data.project_area);
                const layer = wkt.toObject({ color: 'blue', fillOpacity: 0.3 });
                layer.addTo(map);
                map.fitBounds(layer.getBounds());
            }
        });

    } catch (err) {
        console.error(err);
        projectsContainer.innerHTML = `<p class="text-danger">Error loading projects</p>`;
    }
});

// Event delegation for Create Trace buttons
document.getElementById("projectsContainer").addEventListener("click", (e) => {
    if (e.target.classList.contains("create-trace-btn")) {
        const projectId = e.target.getAttribute("data-project-id");
        alert(`Create Trace clicked for Project ${projectId}`);
        // Later: call the POST /projects/{id}/traces endpoint
    }
});
