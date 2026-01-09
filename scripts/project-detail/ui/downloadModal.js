function downloadGeoJSON(trace) {
  const featureCollection = {
    type: "FeatureCollection",
    crs: {
      type: "name",
      properties: { name: "EPSG:28992" },
    },
    features: [
      {
        type: "Feature",
        id: trace.id || 1,
        geometry: trace.geometry,
        properties: {
          name: trace.name,
          description: trace.description || "",
        },
      },
    ],
  };

  const blob = new Blob([JSON.stringify(featureCollection, null, 2)], {
    type: "application/geo+json",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${trace.name.replaceAll(" ", "_")}.geojson`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

export function openDownloadModal(projectData) {
  const modal = document.getElementById("downloadModal");
  modal.style.display = "flex";

  // Handle both project object and full project data structure
  const project = projectData.project || projectData;
  const traces = projectData.traces || project.traces || [];

  document.getElementById("downloadModalProjectName").innerText =
    `Project: ${project.project_name?.replaceAll("_", " ") || "Onbekend"}`;

  const traceListEl = document.getElementById("downloadTraceList");
  traceListEl.innerHTML = "";

  if (!traces || traces.length === 0) {
    traceListEl.innerHTML = "<p>Geen traces beschikbaar.</p>";
    return;
  }

  traces.forEach((trace) => {
    const div = document.createElement("div");
    div.style.display = "flex";
    div.style.justifyContent = "space-between";
    div.style.marginBottom = "5px";

    div.innerHTML = `
      <span>${trace.name}</span>
      <button class="btn btn-sm btn-outline-primary">Download</button>
    `;

    div.querySelector("button").addEventListener("click", () => downloadGeoJSON(trace));
    traceListEl.appendChild(div);
  });
}

export function initDownloadModalClose() {
  document.getElementById("closeDownloadModal")?.addEventListener("click", closeDownloadModal);
}

export function closeDownloadModal() {
  const modal = document.getElementById("downloadModal");
  if (modal) modal.style.display = "none";
}
