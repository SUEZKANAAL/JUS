import { initMap } from "./map/initMap.js";
import { initProj4 } from "./map/initProj4.js";
import { setMap } from "./state.js";
import { initLegend } from "./ui/legend.js";
import { initLayerSwitcher } from "./ui/layerswitcher.js";
import { initPopup } from "./ui/popup.js";
import { bindStreetViewOnDoubleClick } from "./actions/streetViewOnDoubleClick.js";
import { loadProjectData } from "./features/projectLoader.js";

document.addEventListener("DOMContentLoaded", () => {
  initProj4();

  const { map } = initMap();
  setMap(map);

  initLegend();
  initLayerSwitcher();
  initPopup();
  bindStreetViewOnDoubleClick();

  loadProjectData();
});
