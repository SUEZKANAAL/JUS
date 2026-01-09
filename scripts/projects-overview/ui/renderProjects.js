import { 
  getProjects, 
  getCurrentPage, 
  getTotalPages,
  getProjectsPerPage 
} from "../state.js";

export function renderProjects() {
  const container = document.getElementById("projectsContainer");
  if (!container) return;

  container.innerHTML = "";

  const projects = getProjects();
  const currentPage = getCurrentPage();
  const totalPages = getTotalPages();
  const projectsPerPage = getProjectsPerPage();

  // Show message if no projects
  if (projects.length === 0) {
    container.innerHTML = `<p class="text-muted text-center">Geen projecten gevonden.</p>`;
    return;
  }

  // Render project cards (projects are already paginated from backend)
  projects.forEach((project) => {
    const card = document.createElement("div");
    card.classList.add("project-card", "card");

    const dateStr = project.created_at
      ? new Date(project.created_at).toLocaleDateString("nl-NL")
      : "Onbekend";

    card.innerHTML = `
      <div class="card-body">
        <h5 class="card-title text-center">${project.project_name.replaceAll("_", " ")}</h5>
        <p><strong>Aangemaakt op:</strong> ${dateStr}</p>
        <p><strong>Rol:</strong> ${project.role}</p>
        <button class="btn btn-primary mt-3 go-to-project-btn" data-project-id="${project.id}">
          Ga naar Project
        </button>
      </div>
    `;

    container.appendChild(card);

    // Navigate to project detail page
    card.querySelector(".go-to-project-btn")?.addEventListener("click", () => {
      window.location.href = `./project-detail.html?project_id=${project.id}`;
    });
  });

  // Update Pagination Controls
  const pagination = document.getElementById("paginationControls");
  if (!pagination) return;

  if (totalPages > 1) {
    pagination.style.display = "flex";
    
    const currentPageInfo = document.getElementById("currentPageInfo");
    if (currentPageInfo) {
      currentPageInfo.innerText = `Pagina ${currentPage} van ${totalPages}`;
    }

    const firstPageBtn = document.getElementById("firstPageBtn");
    const prevPageBtn = document.getElementById("prevPageBtn");
    const nextPageBtn = document.getElementById("nextPageBtn");
    const lastPageBtn = document.getElementById("lastPageBtn");

    if (firstPageBtn) firstPageBtn.disabled = currentPage === 1;
    if (prevPageBtn) prevPageBtn.disabled = currentPage === 1;
    if (nextPageBtn) nextPageBtn.disabled = currentPage === totalPages;
    if (lastPageBtn) lastPageBtn.disabled = currentPage === totalPages;
  } else {
    pagination.style.display = "none";
  }
}
