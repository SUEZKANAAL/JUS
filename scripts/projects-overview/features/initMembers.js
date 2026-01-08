import { fetchProjectMembers, addMemberToProject } from "../api/members.js";
import { showMembersModal } from "../ui/membersModal.js";
import { getCurrentProjectId } from "../state.js";

export async function fetchMembersCount(projectId) {
  try {
    const members = await fetchProjectMembers(projectId);
    const countSpan = document.getElementById(`member-count-${projectId}`);
    if (countSpan) countSpan.textContent = `(${members.length})`;
  } catch (err) {
    console.error(err);
  }
}

export async function showMembersPopup(projectId) {
  try {
    const members = await fetchProjectMembers(projectId);
    showMembersModal(members);
  } catch (err) {
    console.error(err);
    alert("Failed to fetch members");
  }
}

export function initAddMember() {
  document.getElementById("confirmAddMemberBtn")?.addEventListener("click", async () => {
    const username = document.getElementById("newMemberUsername").value.trim();
    if (!username) return alert("Voer een username in!");

    try {
      const projectId = getCurrentProjectId();
      if (!projectId) return alert("Geen project geselecteerd.");
      await addMemberToProject(projectId, username);

      alert(`Gebruiker ${username} succesvol toegevoegd!`);

      // Hide modal (bootstrap)
      const modalEl = document.getElementById("addMemberModal");
      const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
      modal.hide();

      await fetchMembersCount(projectId);
    } catch (err) {
      console.error(err);
      alert(err.message || "Er is iets misgegaan");
    }
  });
}

