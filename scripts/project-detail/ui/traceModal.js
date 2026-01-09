export function openTraceModal(projectName) {
  const modal = document.getElementById("traceModal");
  modal.style.display = "flex";

  const projectNameEl = document.getElementById("traceModalProjectName");
  if (projectNameEl) projectNameEl.innerText = `Project: ${projectName}`;

  document.getElementById("traceEntriesContainer").innerHTML = "";
  document.getElementById("uploadStatus").innerText = "";
}

export function closeTraceModal() {
  const modal = document.getElementById("traceModal");
  if (!modal) return;

  modal.style.display = "none";

  // reset content
  const entries = document.getElementById("traceEntriesContainer");
  if (entries) entries.innerHTML = "";

  const status = document.getElementById("uploadStatus");
  if (status) status.innerText = "";
}
