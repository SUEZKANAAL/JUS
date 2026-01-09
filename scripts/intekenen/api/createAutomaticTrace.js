import { getApiBaseUrl } from "../../config/apiConfig.js";

export async function createAutomaticTrace(payload) {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(
    `${getApiBaseUrl()}/create-project-automatic-trace`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error("API fout");
  }

  return response.json();
}
