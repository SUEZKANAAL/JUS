import { projectProjection, projection, wmtsProjectionExtent, resolutions, matrixIds, view } from "./projection.js";

export function initMap() {
  const rdNewLayer = new ol.layer.Tile({
    title: 'rd-new',
    type: 'base',
    visible: true,
    source: new ol.source.XYZ({
      url: 'https://services.arcgisonline.nl/arcgis/rest/services/Basiskaarten/Topo/MapServer/tile/{z}/{y}/{x}',
      projection: projectProjection,
    }),
  });

  const Luchtfoto = new ol.layer.Tile({
    title: 'luchtfoto',
    type: 'base',
    visible: false,
    source: new ol.source.XYZ({
      url: 'https://services.arcgisonline.nl/arcgis/rest/services/Luchtfoto/Luchtfoto/MapServer/tile/{z}/{y}/{x}',
      projection: projectProjection,
    }),
  });

  const bgtLayer = new ol.layer.Tile({
    title: 'BGT',
    type: 'base',
    visible: false,
    source: new ol.source.WMTS({
      url: 'https://service.pdok.nl/lv/bgt/wmts/v1_0?',
      layer: 'standaardvisualisatie',
      matrixSet: 'EPSG:28992',
      format: 'application/json',
      projection,
      tileGrid: new ol.tilegrid.WMTS({
        origin: ol.extent.getTopLeft(wmtsProjectionExtent),
        resolutions,
        matrixIds,
      }),
    }),
  });

  const osmLayer = new ol.layer.Tile({
    title: 'OpenStreetMap',
    type: 'base',
    visible: false,
    source: new ol.source.OSM(),
  });

  const baseLayerGroup = new ol.layer.Group({
    title: "Base maps",
    layers: [rdNewLayer, Luchtfoto, bgtLayer, osmLayer],
  });

  const map = new ol.Map({
    target: "viewer-map",
    view,
    layers: [baseLayerGroup],
  });

  return { map };
}
