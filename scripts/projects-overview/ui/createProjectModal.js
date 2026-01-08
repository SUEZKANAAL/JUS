export function openCreateProjectModal() {
  const modal = document.getElementById("createProjectModal");
  if (modal) modal.style.display = "flex";
}

export function closeCreateProjectModal() {
  const modal = document.getElementById("createProjectModal");
  if (modal) modal.style.display = "none";
}

export function setCreateProjectStatus(text, color = "black") {
  const statusEl = document.getElementById("createProjectStatus");
  if (!statusEl) return;

  statusEl.style.color = color;
  statusEl.innerHTML = text;
}

export function clearCreateProjectStatus() {
  const statusEl = document.getElementById("createProjectStatus");
  if (statusEl) statusEl.innerHTML = "";
}
