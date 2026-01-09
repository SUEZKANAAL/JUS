import { getApiBaseUrl } from "../../config/apiConfig.js";

function getToken() {
  return localStorage.getItem("accessToken");
}

export async function addFeaturesToProject(projectId, body) {
  const token = getToken();

  const response = await fetch(
    `${getApiBaseUrl()}/projects/${projectId}/add-features`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    const msg =
      typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail ?? data);
    throw new Error(msg || "Failed to upload feature");
  }

  return data;
}
