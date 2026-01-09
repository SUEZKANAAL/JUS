import { getApiBaseUrl } from "../../config/apiConfig.js";

function getToken() {
  return localStorage.getItem("accessToken");
}

export async function fetchProjectMembers(projectId) {
  const token = getToken();
  const response = await fetch(
    `${getApiBaseUrl()}/projects/${projectId}/members`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!response.ok) throw new Error("Failed to fetch members");
  return response.json();
}

export async function addMemberToProject(projectId, username) {
  const token = getToken();

  const response = await fetch(
    `${getApiBaseUrl()}/projects/${projectId}/add-user`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, role: "collaborator" }),
    }
  );

  const data = await response.json();
  const msg =
    typeof data.detail === "string"
      ? data.detail
      : JSON.stringify(data.detail ?? data);

  if (!response.ok) throw new Error(msg || "Kon gebruiker niet toevoegen");

  return data;
}

