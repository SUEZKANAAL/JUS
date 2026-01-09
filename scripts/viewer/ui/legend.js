// scripts/viewer/ui/legend.js
import { getMap, setLegend } from "../state.js";

export function initLegend() {
  const map = getMap();
  if (!map) {
    throw new Error("initLegend(): map is not set. Call setMap(map) first.");
  }

  // ----------------------------- CREATE LEGEND -----------------------------
  var legend = new ol.legend.Legend({
    title: "Legenda",
    margin: 5,
  });

  var legendControl = new ol.control.Legend({
    legend: legend,
    collapsible: true,
    collapsed: true,
  });

  map.addControl(legendControl);

  setLegend(legend);

  return { legend, legendControl };
}
