import { getProjectId } from "../state.js";

export function openAddMemberModal() {
  document.getElementById("newMemberUsername").value = "";

  const modalEl = document.getElementById("addMemberModal");
  const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
  modal.show();
}
