export function showMembersModal(members) {
  const membersList = document.getElementById("membersList");

  // Safety check — API did not return array
  if (!Array.isArray(members)) {
    console.error("Members API returned invalid data:", members);
    membersList.innerHTML = `<li class="list-group-item text-danger">
      Failed to load members
    </li>`;
    return;
  }

  if (members.length === 0) {
    membersList.innerHTML = `<li class="list-group-item">No members</li>`;
    return;
  }

  membersList.innerHTML = members
    .map(m => `<li class="list-group-item">${m.username} (${m.role})</li>`)
    .join("");

  const modal = new bootstrap.Modal(document.getElementById("membersModal"));
  modal.show();
}
