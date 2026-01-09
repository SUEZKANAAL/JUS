import { getApiBaseUrl } from "../../config/apiConfig.js";

function getToken() {
  return localStorage.getItem("accessToken");
}

export async function fetchProject(projectId) {
  const token = getToken();
  const response = await fetch(`${getApiBaseUrl()}/projects/${projectId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch project");
  return response.json();
}
