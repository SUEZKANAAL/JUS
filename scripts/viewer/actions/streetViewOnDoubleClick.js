// scripts/viewer/actions/streetViewOnDoubleClick.js
import { getMap } from "../state.js";

export function bindStreetViewOnDoubleClick() {
  const map = getMap();
  if (!map) {
    throw new Error("bindStreetViewOnDoubleClick(): map is not set. Call setMap(map) first.");
  }

  // Prevent OL default zoom-on-doubleclick if you want streetview instead
  // (If you still want zoom, remove evt.preventDefault() below.)
  map.on("dblclick", function (evt) {
    evt.preventDefault();

    const coordRD = evt.coordinate; // in map projection (EPSG:28992)
    const [lon, lat] = ol.proj.transform(coordRD, "EPSG:28992", "EPSG:4326");

    const url = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lon}`;

    window.open(url, "_blank", "noopener,noreferrer");
  });

  console.log("[viewer] streetview dblclick bound");
}
