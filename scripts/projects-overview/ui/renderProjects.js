import { getProjectsPerPage, getCurrentPage, setCurrentPage } from "../state.js";

export function renderProjects(projects) {
  const container = document.getElementById("projectsContainer");
  container.innerHTML = "";

  const projectsPerPage = getProjectsPerPage();
  let currentPage = getCurrentPage();

  const totalPages = Math.ceil(projects.length / projectsPerPage);
  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;
  setCurrentPage(currentPage);

  const startIndex = (currentPage - 1) * projectsPerPage;
  const endIndex = startIndex + projectsPerPage;
  const projectsToShow = projects.slice(startIndex, endIndex);

  projectsToShow.forEach((project) => {
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
  if (projects.length > projectsPerPage) {
    pagination.style.display = "flex";
    document.getElementById("currentPageInfo").innerText = `Pagina ${currentPage} van ${totalPages}`;

    document.getElementById("firstPageBtn").disabled = currentPage === 1;
    document.getElementById("prevPageBtn").disabled = currentPage === 1;
    document.getElementById("nextPageBtn").disabled = currentPage === totalPages;
    document.getElementById("lastPageBtn").disabled = currentPage === totalPages;
  } else {
    pagination.style.display = "none";
  }
}
