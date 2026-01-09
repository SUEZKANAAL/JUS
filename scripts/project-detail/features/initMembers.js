import { fetchProjectMembers, addMemberToProject } from "../api/members.js";
import { showMembersModal } from "../ui/membersModal.js";
import { getProjectId } from "../state.js";
import { fetchProject } from "../api/project.js";
import { setProject } from "../state.js";
import { renderProjectInfo } from "../ui/renderProjectInfo.js";

export async function showMembersPopup() {
  try {
    const projectId = getProjectId();
    if (!projectId) {
      alert("Geen project ID beschikbaar");
      return;
    }
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
      const projectId = getProjectId();
      if (!projectId) return alert("Geen project geselecteerd.");
      await addMemberToProject(projectId, username);

      alert(`Gebruiker ${username} succesvol toegevoegd!`);

      // Hide modal (bootstrap)
      const modalEl = document.getElementById("addMemberModal");
      const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
      modal.hide();

      // Refresh member count
      try {
        const members = await fetchProjectMembers(projectId);
        document.getElementById("projectMemberCount").textContent = members.length || 0;
      } catch (err) {
        console.error("Failed to refresh member count:", err);
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Er is iets misgegaan");
    }
  });
}
