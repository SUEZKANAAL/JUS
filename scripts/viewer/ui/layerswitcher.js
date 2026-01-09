// scripts/viewer/ui/layerswitcher.js
import { getMap } from "../state.js";

export function initLayerSwitcher() {
  const map = getMap();
  if (!map) {
    throw new Error("initLayerSwitcher(): map is not set. Call setMap(map) first.");
  }

  // ----------------------------- ADD LAYERSWITCHER -----------------------------
  var layerswitcher = new ol.control.LayerSwitcher({
    mouseover: true,
    trash: true,
  });

  map.addControl(layerswitcher);

  return { layerswitcher };
}
