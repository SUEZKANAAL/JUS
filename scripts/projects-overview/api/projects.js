import { getApiBaseUrl } from "../../config/apiConfig.js";

function getToken() {
  return localStorage.getItem("accessToken");
}

export async function fetchProjects(params = {}) {
  const token = getToken();
  
  // Build query string from params
  const queryParams = new URLSearchParams();
  
  if (params.page !== undefined) queryParams.append("page", params.page);
  if (params.per_page !== undefined) queryParams.append("per_page", params.per_page);
  if (params.search) queryParams.append("search", params.search);
  if (params.date_from) queryParams.append("date_from", params.date_from);
  if (params.date_to) queryParams.append("date_to", params.date_to);
  if (params.sort) queryParams.append("sort", params.sort);
  
  const queryString = queryParams.toString();
  const url = `${getApiBaseUrl()}/projects${queryString ? `?${queryString}` : ""}`;
  
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch projects: ${response.status} ${errorText}`);
  }
  
  return response.json();
}
