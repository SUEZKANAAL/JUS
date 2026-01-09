import { initToggleHulplijnButton } from "./ui/toggleHulplijnButton.js";
import { initMap } from "./map/initMap.js";
import { setMap } from "./state.js";
import { initDraw } from "./draw/initDraw.js";
import { initProj4Defs } from "./draw/wkt.js";
import { bindTraceAanvragenButton } from "./actions/bindTraceAanvragenButton.js";
import { initCurrentUser } from "../auth/ui/currentUser.js";

document.addEventListener("DOMContentLoaded", () => {
  initToggleHulplijnButton();

  const { map } = initMap();
  setMap(map);
  initDraw();
  initProj4Defs();
  bindTraceAanvragenButton();
  initCurrentUser();
});
