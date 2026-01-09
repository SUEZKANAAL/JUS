// scripts/viewer/map/projection.js

export const projectionExtent = [-285401.9200000018, 71093.05539999902, 546906.944600001, 903401.9200000018];

export const projectProjection = new ol.proj.Projection({
  code: "EPSG:28992",
  units: "m",
  extent: projectionExtent,
  origin: [-285401.9200000018, 903401.9200000018],
});

// THIS ONE must be named wmtsProjectionExtent
export const wmtsProjectionExtent = [-285401.92, 22598.08, 595401.9199999999, 903401.9199999999];

export const projection = new ol.proj.Projection({
  code: "EPSG:28992",
  units: "m",
  extent: wmtsProjectionExtent,
});

export const resolutions = [
  3440.64, 1720.32, 860.16, 430.08, 215.04,
  107.52, 53.76, 26.88, 13.44, 6.72,
  3.36, 1.68, 0.84, 0.42, 0.21
];

export const matrixIds = Array.from({ length: 15 }, (_, z) => `EPSG:28992:${z}`);

export const view = new ol.View({
  projection: projectProjection,
  center: [195000, 463000],
  zoom: 3,
});
