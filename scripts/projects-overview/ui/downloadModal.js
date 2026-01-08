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

export function openDownloadModal(project) {
  const modal = document.getElementById("downloadModal");
  modal.style.display = "flex";

  document.getElementById("downloadModalProjectName").innerText =
    `Project: ${project.project_name.replaceAll("_", " ")}`;

  const traceListEl = document.getElementById("downloadTraceList");
  traceListEl.innerHTML = "";

  if (!project.traces || project.traces.length === 0) {
    traceListEl.innerHTML = "<p>Geen traces beschikbaar.</p>";
    return;
  }

  project.traces.forEach((trace) => {
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

