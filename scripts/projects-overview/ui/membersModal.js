export function showMembersModal(members) {
  const membersList = document.getElementById("membersList");
  membersList.innerHTML = members
    .map((m) => `<li class="list-group-item">${m.username} (${m.role})</li>`)
    .join("");

  const modal = new bootstrap.Modal(document.getElementById("membersModal"));
  modal.show();
}
