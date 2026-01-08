import { setCurrentProjectId } from "../state.js";

export function openAddMemberModal(projectId) {
  setCurrentProjectId(projectId);

  document.getElementById("newMemberUsername").value = "";

  const modalEl = document.getElementById("addMemberModal");
  const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
  modal.show();
}
