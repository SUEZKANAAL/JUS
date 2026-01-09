export function validateGeoJSON(geojson) {
  if (
    !geojson ||
    geojson.type !== "FeatureCollection" ||
    !Array.isArray(geojson.features)
  ) {
    return "GeoJSON must be a FeatureCollection with a features array.";
  }

  // Check if features array is empty
  if (geojson.features.length === 0) {
    return "GeoJSON FeatureCollection must contain at least one feature.";
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

    // Validate coordinates are not empty and have proper structure
    const coords = feature.geometry.coordinates;
    const geometryType = feature.geometry.type;

    if (coords.length === 0) {
      return `Feature at index ${i} has empty coordinates.`;
    }

    // Validate coordinate structure based on geometry type
    if (geometryType === "Point") {
      if (!Array.isArray(coords) || coords.length < 2 || typeof coords[0] !== "number" || typeof coords[1] !== "number") {
        return `Feature at index ${i} (Point) has invalid coordinates.`;
      }
    } else if (geometryType === "MultiPoint" || geometryType === "LineString") {
      if (!Array.isArray(coords) || coords.length === 0 || !Array.isArray(coords[0])) {
        return `Feature at index ${i} (${geometryType}) has invalid coordinates.`;
      }
      // Check first coordinate is valid
      if (coords[0].length < 2 || typeof coords[0][0] !== "number" || typeof coords[0][1] !== "number") {
        return `Feature at index ${i} (${geometryType}) has invalid coordinate values.`;
      }
    } else if (geometryType === "MultiLineString" || geometryType === "Polygon") {
      if (!Array.isArray(coords) || coords.length === 0 || !Array.isArray(coords[0]) || !Array.isArray(coords[0][0])) {
        return `Feature at index ${i} (${geometryType}) has invalid coordinates.`;
      }
      // Check first ring has valid coordinates
      if (coords[0].length === 0 || coords[0][0].length < 2 || typeof coords[0][0][0] !== "number" || typeof coords[0][0][1] !== "number") {
        return `Feature at index ${i} (${geometryType}) has invalid coordinate values.`;
      }
    } else if (geometryType === "MultiPolygon") {
      if (!Array.isArray(coords) || coords.length === 0 || !Array.isArray(coords[0]) || !Array.isArray(coords[0][0]) || !Array.isArray(coords[0][0][0])) {
        return `Feature at index ${i} (MultiPolygon) has invalid coordinates.`;
      }
      // Check first polygon, first ring, first coordinate is valid
      if (coords[0].length === 0 || coords[0][0].length === 0 || coords[0][0][0].length < 2 || typeof coords[0][0][0][0] !== "number" || typeof coords[0][0][0][1] !== "number") {
        return `Feature at index ${i} (MultiPolygon) has invalid coordinate values.`;
      }
    }
  }

  return null;
}
