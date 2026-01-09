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
    let msg;
    if (typeof data.detail === "string") {
      msg = data.detail;
    } else if (Array.isArray(data.detail)) {
      // Handle Pydantic validation errors
      msg = data.detail.map(err => {
        const field = err.loc ? err.loc.join(".") : "unknown";
        return `${field}: ${err.msg}`;
      }).join("; ");
    } else {
      msg = JSON.stringify(data.detail ?? data);
    }
    throw new Error(msg || "Failed to upload feature");
  }

  return data;
}
