window.onload = init;

function init() {
    const map = new ol.Map({
        view: new ol.View({
            center: ol.proj.fromLonLat([0, 0]), // Ensure the center is in the correct projection
            zoom: 2
        }),
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            }),
        ],
        target: "viewer-map"
    });

    // Vector layer to hold the features from the JSON file
    const vectorSource = new ol.source.Vector();
    const vectorLayer = new ol.layer.Vector({
        source: vectorSource
    });
    map.addLayer(vectorLayer);

    document.getElementById('jsonFileInput').addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const features = new ol.format.GeoJSON().readFeatures(e.target.result, {
                    dataProjection: 'EPSG:4326', // Assuming the GeoJSON is in WGS 84
                    featureProjection: map.getView().getProjection() // Project features to the map projection
                });
                vectorSource.addFeatures(features);
                map.getView().fit(vectorSource.getExtent()); // Zoom to the extent of the features
            };
            reader.readAsText(file);
        }
    });
}