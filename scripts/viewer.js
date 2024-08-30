var projectionExtent = [-285401.9200000018, 71093.05539999902, 546906.944600001, 903401.9200000018];
var projectProjection = new ol.proj.Projection({ code: 'EPSG:28992', units: 'm', extent: projectionExtent, origin: [-285401.9200000018, 903401.9200000018] });


// Define the view with the correct projection
var view = new ol.View({
    projection: projectProjection,
    center: [195000, 463000], // Center on a point in the Netherlands, adjust as needed
    zoom: 3
});

var rdNewLayer = new ol.layer.Tile({
    title: 'rd-new',
    type: 'base',
    visible: true,
    source: new ol.source.XYZ({
        url: 'https://services.arcgisonline.nl/arcgis/rest/services/Basiskaarten/Topo/MapServer/tile/{z}/{y}/{x}',
        projection: projectProjection,
    }),
    origin: [-285401.9200000018, 903401.9200000018],
})

var Luchtfoto = new ol.layer.Tile({
    title: 'luchtfoto',
    type: 'base',
    visible: false,
    source: new ol.source.XYZ({
        url: 'https://services.arcgisonline.nl/arcgis/rest/services/Luchtfoto/Luchtfoto/MapServer/tile/{z}/{y}/{x}',
        projection: projectProjection,
    }),
    origin: [-285401.9200000018, 903401.9200000018],
})


// create the map and add the layers
const map = new ol.Map({
    target: "viewer-map",
    view: view,
    layers: [rdNewLayer, Luchtfoto],
});

function klicStyle(feature) {
    const gmlId = feature.get('gml_id');
    const styles = {
        'datatransport': { color: 'rgba(0, 255, 0, 1.0)', width: 2 },
        'ElektriciteitskabelMs': { color: 'rgba(200, 0, 0, 1.0)', width: 2 },
        'ElektriciteitskabelLs': { color: 'rgba(150, 0, 0, 1.0)', width: 2 },
        'OlieGasChemicalienPijpleidingLD': { color: 'rgba(255, 215, 80, 1.0)', width: 2 },
        'OlieGasChemicalienPijpleidingHD': { color: 'rgba(255, 175, 60, 1.0)', width: 2 }
    };

    let selectedStyle = { color: '#0000FF', width: 2 }; // Default style

    if (gmlId) {
        for (const [key, style] of Object.entries(styles)) {
            if (gmlId.includes(key.replace(/Ms|Ls|LD|HD$/, '')) && gmlId.includes(key.slice(-2))) {
                selectedStyle = style;
                break;
            }
        }
    }

    return new ol.style.Style({
        fill: new ol.style.Fill({
            color: selectedStyle.color,
        }),
        stroke: new ol.style.Stroke({
            color: selectedStyle.color,
            width: selectedStyle.width,
        }),
    });
}


// Function to create a visual representation of the feature type
function createFeatureIcon(type, color) {
    const icon = document.createElement('span');
    icon.style.display = 'inline-block';
    icon.style.marginRight = '5px';

    switch (type) {
        case 'Point':
            icon.style.borderRadius = '50%'; // Circle shape
            icon.style.width = '10px';
            icon.style.height = '10px';
            break;
        case 'MultiPoint':
            icon.style.borderRadius = '50%'; // Circle shape
            icon.style.width = '10px';
            icon.style.height = '10px';
            break;
        case 'LineString':
            icon.style.borderBottom = '2px solid';
            icon.style.width = '20px';
            icon.style.height = '2px';
            break;
        case 'Polygon':
            icon.style.border = '2px solid';
            icon.style.width = '10px';
            icon.style.height = '10px';
            break;
    }
    if (type !== 'Polygon') {
        icon.style.backgroundColor = color;
    }
    icon.style.borderColor = color;


    return icon;
}

function generateRandomRGBColor(transperancy = 1.0) {
    // Generate random values for red, green, and blue between 0 and 255
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);
    console.log(`rgba(${red}, ${green}, ${blue}, ${transperancy})`);
    return `rgba(${red}, ${green}, ${blue}, ${transperancy})`;
}

function createCircleStyle(color = 'rgba(0, 0, 255, 1.0)') {
    return new ol.style.Style({
        image: new ol.style.Circle({
            radius: 5,
            fill: new ol.style.Fill({
                color: color,
            }),
            stroke: new ol.style.Stroke({
                color: color,
                width: 1,
            }),
        }),
    });
}

function createPolygonStyle(color = 'rgba(0, 0, 255, 0.3)') {
    return new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: color,
            width: 2,
        }),
        fill: new ol.style.Fill({
            color: color,
        }),
    });
}

function createLineStyle(color = 'rgba(0, 0, 255, 1.0)') {
    return new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: color,
            width: 2,
        }),
    });
}


document.getElementById('jsonFileInput').addEventListener('change', function (event) {
    const files = event.target.files;

    const processFile = (file) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const features = new ol.format.GeoJSON().readFeatures(e.target.result, {
                dataProjection: 'EPSG:29882',
                featureProjection: map.getView().getProjection()
            });

            // Create a vector source and layer for this GeoJSON
            const vectorSource = new ol.source.Vector({
                features: features
            });
            const vectorLayer = new ol.layer.Vector({
                source: vectorSource,
                title: file.name,
                style: function (feature) {
                    // Determine the geometry type of the feature
                    const geometryType = feature.getGeometry().getType();

                    // Check if the feature is a point and apply circle styling
                    if ((geometryType === 'Point' || geometryType === 'MultiPoint') && file.name !== 'Start_Eind_Punt.geojson') {
                        return createCircleStyle();
                    }

                    // Check if the feature is a point and apply circle styling
                    if ((geometryType === 'Polygon' || geometryType === 'MultiPolygon') && file.name !== 'Projectgebied.geojson') {
                        return createPolygonStyle();
                    }

                    // Check if the feature is a point and apply circle styling
                    if ((geometryType === 'Line' || geometryType === 'MultiLine')) {
                        return createLineStyle();
                    }

                    switch (file.name) {
                        case 'klic.geojson': // styling should be changed based on gml id 
                            return klicStyle(feature);
                        case 'Start_Eind_Punt.geojson':
                            return createCircleStyle('rgba(255, 0, 0, 1.0)');
                        case "Doorlooptijd.geojson":
                        case 'Trace_Doorlooptijd_smooth.geojson':
                            return createLineStyle('rgba(0, 0, 255, 1.0)'); // blue
                        case 'Kosten.geojson':
                        case 'Trace_Kosten_smooth.geojson':
                            return createLineStyle('rgba(255, 0, 0, 1.0)'); // red
                        case 'Lengte.geojson':
                        case 'Trace_Lengte_smooth.geojson':
                            return createLineStyle('rgba(0, 0, 0, 1.0)'); // Green
                        case 'Projectgebied.geojson':
                            return createPolygonStyle('rgba(0, 0, 0, 0.1)')//black

                    }
                }

            });

            map.addLayer(vectorLayer);

            // Calculate the extent of the features
            const extent = vectorSource.getExtent();

            // Check if the extent is valid (not infinite)
            if (extent && !ol.extent.isEmpty(extent)) {
                // Zoom to the extent of the layer with animation
                map.getView().fit(extent, {
                    duration: 1000, // Animation duration in milliseconds
                    padding: [50, 50, 50, 50] // Padding around the extent [top, right, bottom, left] in pixels
                });
            }

        };
        reader.readAsText(file);
    };

    for (let i = 0; i < files.length; i++) {
        processFile(files[i]);
    }
});

// Add a layer switcher to the map
var layerswitcher = new ol.control.LayerSwitcher({
    mouseover: true,
    trash: true,

});
map.addControl(layerswitcher);



// add a scalebar
var scaleControl = new ol.control.Scale({
    bar: true,
    minWidth: 200,
});


map.addControl(scaleControl);


// click on map and show features

const popup = document.getElementById('popup');
const popupCloser = document.getElementById('popup-closer');
const popupContent = document.getElementById('popup-content');

popupCloser.onclick = function () {
    popup.style.display = 'none';
    popupCloser.blur();
    return false;
};

map.on('singleclick', function (evt) {
    const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
        return feature;
    });

    if (feature) {
        const coordinates = evt.coordinate;
        const properties = feature.getProperties();
        delete properties.geometry;

        const propertiesStr = Object.keys(properties).map(key => `${key}: ${properties[key]}`).join('<br>');
        popupContent.innerHTML = propertiesStr;
        popup.style.display = 'block';
        const overlay = new ol.Overlay({
            element: popup,
            positioning: 'bottom-center',
            stopEvent: false,
            offset: [0, -10]
        });
        map.addOverlay(overlay);
        overlay.setPosition(coordinates);
    } else {
        popup.style.display = 'none';
    }
});



// link to google streetview 
proj4.defs("EPSG:28992", "+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +units=m +no_defs");
ol.proj.proj4.register(proj4);

map.on('dblclick', function (evt) {
    evt.preventDefault(); // Prevent the default double-click zoom

    const coordinates = ol.proj.transform(evt.coordinate, "EPSG:28992", 'EPSG:4326');
    const lon = coordinates[0];
    const lat = coordinates[1];

    // Construct Google Street View URL
    const streetViewUrl = `https://www.google.com/maps?layer=c&cbll=${lat},${lon}`;

    // Open URL in a new tab
    window.open(streetViewUrl, '_blank');
});






