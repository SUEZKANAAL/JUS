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



document
  .getElementById("addTraceEntryBtn")
  .addEventListener("click", window.__projectsOverviewAddTraceEntry?.());








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







