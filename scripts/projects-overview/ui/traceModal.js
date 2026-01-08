export function openTraceModal(projectName) {
  const modal = document.getElementById("traceModal");
  modal.style.display = "flex";

  const projectNameEl = document.getElementById("traceModalProjectName");
  if (projectNameEl) projectNameEl.innerText = `Project: ${projectName}`;

  document.getElementById("traceEntriesContainer").innerHTML = "";
  document.getElementById("uploadStatus").innerText = "";
}

export function closeTraceModal() {
  document.getElementById("traceModal").style.display = "none";
  document.getElementById("traceEntriesContainer").innerHTML = "";
  document.getElementById("uploadStatus").innerText = "";
}
