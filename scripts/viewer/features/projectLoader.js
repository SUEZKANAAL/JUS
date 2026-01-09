import { getMap } from "../state.js";
import { getFeatureStyle } from "../styles/geojsonStyles.js";
import { getApiBaseUrl } from "../../config/apiConfig.js";

let combinedExtent = ol.extent.createEmpty();
let hasExtent = false;

function extendExtentFromFeatures(features) {
  if (!features || features.length === 0) return;

  const source = new ol.source.Vector({ features });
  const extent = source.getExtent();

  if (!ol.extent.isEmpty(extent)) {
    ol.extent.extend(combinedExtent, extent);
    hasExtent = true;
  }
}

function getOrCreateLayerGroup(map, name) {
  // Try to find an existing group with this title
  const existing = map
    .getLayers()
    .getArray()
    .find((l) => l instanceof ol.layer.Group && l.get("title") === name);

  if (existing) return existing;

  const group = new ol.layer.Group({
    title: name,
    layers: [],
  });

  map.addLayer(group);
  return group;
}

function addVectorLayer(groupName, title, features, styleFn) {
  const map = getMap();
  if (!map) throw new Error("addVectorLayer(): map not set");
  if (!features || features.length === 0) return;

  const layer = new ol.layer.Vector({
    title,
    source: new ol.source.Vector({ features }),
    style: styleFn,
  });

  getOrCreateLayerGroup(map, groupName).getLayers().push(layer);
  extendExtentFromFeatures(features);
}

export function loadProjectData() {
  const map = getMap();
  if (!map) throw new Error("loadProjectData(): map is not set");

  const projectId = new URLSearchParams(window.location.search).get("project_id");
  if (!projectId) {
    console.warn("[viewer] No project_id in URL, skipping loadProjectData()");
    return;
  }

  const token = localStorage.getItem("accessToken");
  if (!token) {
    console.warn("[viewer] No accessToken in localStorage, skipping loadProjectData()");
    return;
  }

  fetch(`${getApiBaseUrl()}/projects/${projectId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error(`Failed to load project (${res.status})`);
      return res.json();
    })
    .then((data) => {
      const { project = {}, traces = [], features = [] } = data;

      // -------------------------------
      // 1) Project geometries
      // -------------------------------
      const projectGeometries = [
        {
          key: "project_area",
          title: "Project Area",
          style: { strokeColor: "#000", strokeWidth: 2, fillColor: "rgba(0,0,0,0.1)" },
        },
        {
          key: "start_end_points",
          title: "Start / End Points",
          style: { radius: 6, fillColor: "#ff0000" },
        },
        {
          key: "nogo_zones",
          title: "No-Go Zones",
          style: { strokeColor: "#d32f2f", strokeWidth: 2, fillColor: "rgba(211,47,47,0.3)" },
        },
        {
          key: "auxiliary_lines",
          title: "Auxiliary Lines",
          style: { strokeColor: "#f9a825", strokeWidth: 2, lineDash: [6, 4] },
        },
        {
          key: "bore_lines",
          title: "Bore Lines",
          style: { strokeColor: "#000", strokeWidth: 2 },
        },
      ];

      projectGeometries.forEach(({ key, title, style }) => {
        if (!project[key]) return;

        const olFeatures = new ol.format.GeoJSON().readFeatures(
          {
            type: "FeatureCollection",
            features: [{ type: "Feature", geometry: project[key] }],
          },
          {
            dataProjection: "EPSG:28992",
            featureProjection: map.getView().getProjection(),
          }
        );

        addVectorLayer("Project Geometries", title, olFeatures, (f) => getFeatureStyle(f, style));
      });

      // -------------------------------
      // 2) Traces
      // -------------------------------
      traces.forEach((trace) => {
        if (!trace.geometry) return;

        const olFeatures = new ol.format.GeoJSON().readFeatures(
          {
            type: "FeatureCollection",
            features: [{ type: "Feature", geometry: trace.geometry }],
          },
          {
            dataProjection: "EPSG:28992",
            featureProjection: map.getView().getProjection(),
          }
        );

        addVectorLayer("Project Traces", trace.name, olFeatures, (f) =>
          getFeatureStyle(f, { strokeColor: "#2196f3", strokeWidth: 2 })
        );
      });

      // -------------------------------
      // 3) Stored project features (GeoJSON)
      // -------------------------------
      features.forEach((f) => {
        if (!f.geojson) return;

        const olFeatures = new ol.format.GeoJSON().readFeatures(f.geojson, {
          dataProjection: "EPSG:28992",
          featureProjection: map.getView().getProjection(),
        });

        addVectorLayer("Project Features", f.name, olFeatures, (feat) => getFeatureStyle(feat, {}));
      });

      // -------------------------------
      // 4) Zoom
      // -------------------------------
      if (hasExtent) {
        map.getView().fit(combinedExtent, {
          padding: [50, 50, 50, 50],
          duration: 800,
          maxZoom: 14,
        });
      } else {
        console.warn("[viewer] No geometries available to zoom");
      }

      console.log("[viewer] project loaded", { projectId });
    })
    .catch((err) => console.error("[viewer] Error loading project:", err));
}
