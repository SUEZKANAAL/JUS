// scripts/viewer/styles/geojsonStyles.js

export function getFeatureStyle(feature, options = {}) {
  const type = feature.getGeometry().getType();

  // Point / MultiPoint
  if (type === "Point" || type === "MultiPoint") {
    return new ol.style.Style({
      image: new ol.style.Circle({
        radius: options.radius || 5,
        fill: new ol.style.Fill({ color: options.fillColor || "red" }),
        stroke: options.strokeColor
          ? new ol.style.Stroke({ color: options.strokeColor, width: options.strokeWidth || 1 })
          : undefined,
      }),
    });
  }

  // LineString / MultiLineString
  if (type === "LineString" || type === "MultiLineString") {
    return new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: options.strokeColor || "blue",
        width: options.strokeWidth || 2,
        lineDash: options.lineDash,
      }),
    });
  }

  // Polygon / MultiPolygon
  if (type === "Polygon" || type === "MultiPolygon") {
    return new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: options.strokeColor || "blue",
        width: options.strokeWidth || 2,
      }),
      fill: new ol.style.Fill({
        color: options.fillColor || "rgba(0,0,255,0.2)",
      }),
    });
  }

  return undefined;
}
