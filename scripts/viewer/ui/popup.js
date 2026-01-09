// scripts/viewer/ui/popup.js
import { getMap } from "../state.js";

export function initPopup() {
  const map = getMap();
  if (!map) {
    throw new Error("initPopup(): map is not set. Call setMap(map) first.");
  }

  // ----------------------------- VIEW FEATURES ATTRIBUTES -----------------------------
  const popup = document.getElementById("popup");
  const popupCloser = document.getElementById("popup-closer");
  const popupContent = document.getElementById("popup-content");

  if (!popup || !popupCloser || !popupContent) {
    throw new Error("initPopup(): missing popup DOM elements (#popup, #popup-closer, #popup-content).");
  }

  popupCloser.onclick = function (event) {
    event.preventDefault();
    event.stopPropagation();
    popup.style.display = "none";
    popupCloser.blur();
    return false;
  };

  // Create overlay once (cleaner than creating one per click)
  const overlay = new ol.Overlay({
    element: popup,
    positioning: "bottom-center",
    stopEvent: false,
    offset: [0, -10],
  });
  map.addOverlay(overlay);

  map.on("singleclick", function (evt) {
    const target = evt.originalEvent.target;
    if (popup.contains(target)) return;

    let layerName = "";
    const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
      if (layer) {
        layerName = layer.get("title") || "Unnamed Layer";
      }
      return feature;
    });

    if (feature) {
      const coordinates = evt.coordinate;
      const properties = feature.getProperties();
      delete properties.geometry;

      const propertiesStr = Object.keys(properties)
        .map((key) => `${key}: ${properties[key]}`)
        .join("<br>");

      popupContent.innerHTML = `<strong>${layerName}</strong><br>${propertiesStr}`;
      popup.style.display = "block";
      overlay.setPosition(coordinates);
    } else {
      popup.style.display = "none";
      overlay.setPosition(undefined);
    }
  });

  return { overlay };
}
