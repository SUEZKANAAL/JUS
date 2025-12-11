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
        const projectsResponse = await fetch("https://sue-fastapi.onrender.com/projects", {
            headers: { "x-api-key": apiKey }
        });

        if (!projectsResponse.ok) throw new Error("Failed to fetch projects list");
        const projects = await projectsResponse.json();

        if (projects.length === 0) {
            projectsContainer.innerHTML = "<p class='text-muted'>No projects found.</p>";
            return;
        }

        // Fetch details for each project
        for (let project of projects) {
            try {
                const detailResponse = await fetch(`https://sue-fastapi.onrender.com/projects/${project.id}`, {
                    headers: { "x-api-key": apiKey }
                });
                if (!detailResponse.ok) throw new Error(`Failed to fetch project ${project.id}`);

                const data = await detailResponse.json();

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
                projectsContainer.innerHTML += `<p class="text-danger">Error loading project ${project.id}</p>`;
            }
        }

    } catch (err) {
        console.error(err);
        projectsContainer.innerHTML = `<p class="text-danger">Error fetching projects: ${err.message}</p>`;
    }
});
