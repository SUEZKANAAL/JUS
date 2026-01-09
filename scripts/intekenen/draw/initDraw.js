// scripts/intekenen/draw/initDraw.js
import {
  map,
  setDrawnItems,
  currentDrawingType,
  setCurrentDrawingType,
  currentDrawControl,
  setCurrentDrawControl,
} from "../state.js";

export function initDraw() {
  if (!map) {
    console.error("[intekenen] initDraw: map is not set yet");
    return;
  }

  // FeatureGroup to store editable layers
  const drawnItems = new L.FeatureGroup();
  map.addLayer(drawnItems);
  setDrawnItems(drawnItems);

  // Draw control (edit enabled, drawing tools disabled because you use custom buttons)
  const drawControl = new L.Control.Draw({
    edit: { featureGroup: drawnItems },
    draw: false,
  });
  map.addControl(drawControl);

  // When a shape is created, store it and tag it with the currentDrawingType
  map.on(L.Draw.Event.CREATED, (event) => {
    const layer = event.layer;
    drawnItems.addLayer(layer);
    layer.type = currentDrawingType; // read from shared state
  });

  // Icons
  const redIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  // Individual drawing tools
  const drawControlProjectArea = new L.Draw.Polygon(map, {
    shapeOptions: { color: "blue", fill: false },
  });

  const drawControlStartEndPoint = new L.Draw.Marker(map, { icon: redIcon });

  const drawControlNoGoZone = new L.Draw.Polygon(map, {
    shapeOptions: { color: "red" },
  });

  const drawControlHulplijn = new L.Draw.Polyline(map, {
    shapeOptions: { color: "orange" },
  });

  const drawControlBoorlijn = new L.Draw.Polyline(map, {
    shapeOptions: { color: "black" },
  });

  // Helper to enable one tool at a time
  function enableTool(type, tool) {
    if (currentDrawControl) currentDrawControl.disable();
    setCurrentDrawingType(type);
    tool.enable();
    setCurrentDrawControl(tool);
  }

  // Bind buttons
  document.getElementById("drawProjectArea")?.addEventListener("click", () => {
    enableTool("projectgebiedWKT", drawControlProjectArea);
  });

  document.getElementById("drawStartEndPoint")?.addEventListener("click", () => {
    enableTool("startEindPuntWKT", drawControlStartEndPoint);
  });

  document.getElementById("drawNoGoZone")?.addEventListener("click", () => {
    enableTool("nogoZonesWKT", drawControlNoGoZone);
  });

  document.getElementById("drawHulplijn")?.addEventListener("click", () => {
    enableTool("hulplijnenWKT", drawControlHulplijn);
  });

  document.getElementById("drawBoorlijn")?.addEventListener("click", () => {
    enableTool("boorlijnenWKT", drawControlBoorlijn);
  });
}
