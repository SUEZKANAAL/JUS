document.getElementById("loadProjectsBtn").addEventListener("click", async () => {
    const apiKey = document.getElementById("apiKeyInput").value.trim();
    if (!apiKey) {
        alert("Please enter your API key!");
        return;
    }

    const projectsContainer = document.getElementById("projectsContainer");
    projectsContainer.innerHTML = ""; // clear previous

    // Example: list of project IDs, can be replaced with a dynamic endpoint
    const projectIds = [1, 2, 3];

    for (let id of projectIds) {
        try {
            const response = await fetch(`https://sue-fastapi.onrender.com/projects/${id}?api_key=${apiKey}`);
            if (!response.ok) throw new Error(`Failed to fetch project ${id}`);

            const data = await response.json();

            const card = document.createElement("div");
            card.classList.add("col-md-4", "project-card");
            card.innerHTML = `
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${data.project.project_name}</h5>
                        <p class="card-text"><strong>ID:</strong> ${data.project.id}</p>
                        <p class="card-text"><strong>Area:</strong> ${data.project.project_area}</p>
                        <p class="card-text"><strong>Traces:</strong> ${data.traces.length}</p>
                    </div>
                </div>
            `;
            projectsContainer.appendChild(card);

        } catch (err) {
            console.error(err);
            projectsContainer.innerHTML += `<p class="text-danger">Error loading project ${id}</p>`;
        }
    }
});
