// scripts/intekenen/features/initMap.js
import { RD } from "./rdCrs.js";

export function initMap() {
  const defaultBaseMap = L.tileLayer(
    "https://services.arcgisonline.nl/arcgis/rest/services/Basiskaarten/Topo/MapServer/tile/{z}/{y}/{x}",
    { attribution: 'Map data &copy; <a href="https://www.arcgis.com/">ArcGIS</a>' }
  );

  const secondBaseMap = L.tileLayer(
    "https://services.arcgisonline.nl/arcgis/rest/services/Luchtfoto/Luchtfoto/MapServer/tile/{z}/{y}/{x}",
    { attribution: 'Map data &copy; <a href="https://www.arcgis.com/">ArcGIS</a>' }
  );

  const map = L.map("map", {
    layers: [defaultBaseMap],
    crs: RD,
    maxZoom: 14.4,
  }).setView([52.2354, 5.3751], 3);

  const baseMaps = { Topo: defaultBaseMap, Luchtfoto: secondBaseMap };
  L.control.layers(baseMaps).addTo(map);

  // search bar
  L.Control.geocoder().addTo(map);

  // location button
  L.control.locate().addTo(map);

  return { map };
}
