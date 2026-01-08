export function validateGeoJSON(geojson) {
  if (
    !geojson ||
    geojson.type !== "FeatureCollection" ||
    !Array.isArray(geojson.features)
  ) {
    return "GeoJSON must be a FeatureCollection with a features array.";
  }

  for (let i = 0; i < geojson.features.length; i++) {
    const feature = geojson.features[i];

    if (!feature.type || feature.type !== "Feature") {
      return `Feature at index ${i} missing type 'Feature'.`;
    }

    if (
      !feature.geometry ||
      !feature.geometry.type ||
      !Array.isArray(feature.geometry.coordinates)
    ) {
      return `Feature at index ${i} has invalid geometry.`;
    }

    const validTypes = [
      "Point",
      "MultiPoint",
      "LineString",
      "MultiLineString",
      "Polygon",
      "MultiPolygon",
    ];

    if (!validTypes.includes(feature.geometry.type)) {
      return `Feature at index ${i} has unsupported type '${feature.geometry.type}'.`;
    }
  }

  return null;
}
