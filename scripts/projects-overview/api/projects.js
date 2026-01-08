function getToken() {
  return localStorage.getItem("accessToken");
}

export async function fetchProjects() {
  const token = getToken();
  const response = await fetch("https://sue-fastapi.onrender.com/projects", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch projects");
  return response.json();
}
