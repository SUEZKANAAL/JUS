import { getProjectsPerPage, getCurrentPage, setCurrentPage, setCurrentProjectId  } from "../state.js";
import { openTraceModal } from "./traceModal.js"


export function renderProjects(projects) {
  const services = window.__projectsOverviewServices;
  if (!services) throw new Error("Missing window.__projectsOverviewServices");

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

  const role = localStorage.getItem("role"); // "admin" or "user"

  projectsToShow.forEach((project) => {
    const card = document.createElement("div");
    card.classList.add("project-card", "card");

    const dateStr = project.created_at
      ? new Date(project.created_at).toLocaleDateString("nl-NL")
      : "Onbekend";

    let adminButtonsHTML = "";
    if (role === "admin") {
      adminButtonsHTML = `
        <button class="btn btn-outline-primary mb-2 create-trace-btn" 
                data-project-id="${project.id}" 
                data-project-name="${project.project_name}">
          Upload Trace
        </button>

        <button class="btn btn-outline-primary mb-2 create-feature-btn" 
                data-project-id="${project.id}" 
                data-project-name="${project.project_name}">
          Upload Features
        </button>
      `;
    }

    card.innerHTML = `
      <div class="card-body">
        <h5 class="card-title text-center">${project.project_name.replaceAll("_", " ")}</h5>
        <p><strong>Aangemaakt op:</strong> ${dateStr}</p>
        <p><strong>Rol:</strong> ${project.role}</p>
        <p>
          <strong>Aantal Leden:</strong> 
          <span id="member-count-${project.id}">...</span>  
        </p>
        <button class="btn btn-sm btn-light ms-2 view-members-btn" data-project-id="${project.id}">
          Bekijk Leden
        </button>
        <button class="btn btn-sm btn-light ms-2 add-member-btn" data-project-id="${project.id}">
          Voeg Lid Toe
        </button>
        <p><strong>Aantal Traces:</strong> ${project.traces.length}</p>
        ${adminButtonsHTML}
        <button class="btn btn-primary mb-2 download-trace-btn" data-project-id="${project.id}">
          Download Traces
        </button>
        <button class="btn btn-primary mb-2 view-project-btn" data-project-id="${project.id}">
          Bekijk Project
        </button>
      </div>
    `;

    container.appendChild(card);

    // Fetch members count
    services.fetchMembersCount(project.id);

    // View members
    card.querySelector(".view-members-btn")?.addEventListener("click", async () => {
      await services.showMembersPopup(project.id);
    });

    // Add member
    card.querySelector(".add-member-btn")?.addEventListener("click", () => {
      setCurrentProjectId(project.id);
      services.openAddMemberModal(project.id);
    });

    // View project
    card.querySelector(".view-project-btn")?.addEventListener("click", () => {
      window.open(`/pages/viewer.html?project_id=${project.id}`, "_blank");
    });

    // Upload Trace button
    card.querySelector(".create-trace-btn")?.addEventListener("click", () => {
      setCurrentProjectId(project.id);
      openTraceModal(project.project_name.replaceAll("_", " "));
    });

    // Upload Feature button
    card.querySelector(".create-feature-btn")?.addEventListener("click", () => {
      setCurrentProjectId(project.id);
      services.openFeatureModal(project);
    });

    // Download Traces
    card.querySelector(".download-trace-btn")?.addEventListener("click", () => {
      services.openDownloadModal(project.id);
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
