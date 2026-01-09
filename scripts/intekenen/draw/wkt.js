// scripts/intekenen/draw/wkt.js

export function initProj4Defs() {
  proj4.defs([
    ["EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs"],
    [
      "EPSG:28992",
      "+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +towgs84=565.2369,50.0087,465.658,-0.406857330322398,0.350732676542563,-1.8703473836068,4.0812 +no_defs",
    ],
  ]);
}

export function toRDNew(lat, lng) {
  return proj4("EPSG:4326", "EPSG:28992", [lng, lat]);
}

// Convert Leaflet layer to WKT in RD New
export function toWKT(layer) {
  if (layer instanceof L.Polygon) {
    let coords = layer
      .getLatLngs()[0]
      .map((latLng) => {
        const [x, y] = toRDNew(latLng.lat, latLng.lng);
        return `${x} ${y}`;
      })
      .join(", ");

    // close polygon
    coords += ", " + coords.split(", ")[0];
    return `POLYGON ((${coords}))`;
  }

  if (layer instanceof L.Polyline) {
    const coords = layer
      .getLatLngs()
      .map((latLng) => {
        const [x, y] = toRDNew(latLng.lat, latLng.lng);
        return `${x} ${y}`;
      })
      .join(", ");

    return `LINESTRING (${coords})`;
  }

  if (layer instanceof L.Marker) {
    const { lat, lng } = layer.getLatLng();
    const [x, y] = toRDNew(lat, lng);
    return `POINT (${x} ${y})`;
  }

  return null;
}
