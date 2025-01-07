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

// create basemap layer group
var baseLayerGroup = new ol.layer.Group({
    title: "Base maps",
    layers: [rdNewLayer, Luchtfoto]
});


// create the map and add the layers
const map = new ol.Map({
    target: "viewer-map",
    view: view,
    layers: [baseLayerGroup],
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

// // Function to create a visual representation of the feature type in legend
// function createFeatureIcon(type, color) {
//     const icon = document.createElement('span');
//     icon.style.display = 'inline-block';
//     icon.style.marginRight = '5px';

//     switch (type) {
//         case 'Point':
//             icon.style.borderRadius = '50%'; // Circle shape
//             icon.style.width = '10px';
//             icon.style.height = '10px';
//             break;
//         case 'MultiPoint':
//             icon.style.borderRadius = '50%'; // Circle shape
//             icon.style.width = '10px';
//             icon.style.height = '10px';
//             break;
//         case 'LineString':
//             icon.style.borderBottom = '2px solid';
//             icon.style.width = '20px';
//             icon.style.height = '2px';
//             break;
//         case 'Polygon':
//             icon.style.border = '2px solid';
//             icon.style.width = '10px';
//             icon.style.height = '10px';
//             break;
//     }
//     if (type !== 'Polygon') {
//         icon.style.backgroundColor = color;
//     }
//     icon.style.borderColor = color;
// return icon;
// }

function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return [r, g, b];
}



function createCircleStyle(color_rgb_list = [0, 0, 255], transperancy = 1) {
    rgba_color = `rgba(${color_rgb_list[0]}, ${color_rgb_list[1]}, ${color_rgb_list[2]}, ${transperancy})`
    return new ol.style.Style({
        image: new ol.style.Circle({
            radius: 5,
            fill: new ol.style.Fill({
                color: rgba_color,
            }),
            stroke: new ol.style.Stroke({
                color: rgba_color,
                width: 1,
            }),
        }),
    });
}

function createPolygonStyle(color_rgb_list = [0, 0, 255], transperancy = 0.3) {
    rgba_color_outline = `rgba(${color_rgb_list[0]}, ${color_rgb_list[1]}, ${color_rgb_list[2]}, 1)`
    rgba_color_fill = `rgba(${color_rgb_list[0]}, ${color_rgb_list[1]}, ${color_rgb_list[2]}, ${transperancy})`
    return new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: rgba_color_outline,
            width: 2,
        }),

        fill: new ol.style.Fill({
            color: rgba_color_fill,
        }),
    });
}

function createLineStyle(color_rgb_list = [0, 0, 255], transperancy = 1) {
    rgba_color = `rgba(${color_rgb_list[0]}, ${color_rgb_list[1]}, ${color_rgb_list[2]}, ${transperancy})`
    return new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: rgba_color,
            width: 2,
        }),
    });
}

var color_index = 0;

// document.getElementById('jsonFileInput').addEventListener('change', function (event) {
//     const files = event.target.files;
//     const layergroups = {};

//     const processFile = (file) => {
//         const reader = new FileReader();
//         reader.onload = function (e) {
//             const features = new ol.format.GeoJSON().readFeatures(e.target.result, {
//                 dataProjection: 'EPSG:29882',
//                 featureProjection: map.getView().getProjection()
//             });

//             // Create a vector source and layer for this GeoJSON
//             const vectorSource = new ol.source.Vector({
//                 features: features
//             });
//             const vectorLayer = new ol.layer.Vector({
//                 source: vectorSource,
//                 title: file.name,
//                 style: function (feature) {
//                     let firstFeature = vectorSource.getFeatures()[0];
//                     let color = firstFeature.get('color');
//                     if (!color) {
//                         color = getRandomColor();
//                         feature.set('color', color); // Store the color in the feature's properties
//                     }
//                     else {
//                         feature.set('color', color);
//                     }

//                     switch (file.name) {
//                         case 'klic.geojson': // styling should be changed based on gml id 
//                             return klicStyle(feature);
//                         case 'Start_Eind_Punt.geojson':
//                             return createCircleStyle(color = [255, 0, 0], transparancy = 1.0);
//                         case "Doorlooptijd.geojson":
//                         case 'Trace_Doorlooptijd_smooth.geojson':
//                             return createLineStyle(color = [0, 0, 255], transparancy = 1.0); // blue
//                         case 'Kosten.geojson':
//                         case 'Trace_Kosten_smooth.geojson':
//                             return createLineStyle(color = [255, 0, 0], transparancy = 1.0); // red
//                         case 'Lengte.geojson':
//                         case 'Trace_Lengte_smooth.geojson':
//                             return createLineStyle(color = [0, 255, 0], transparancy = 1.0); // Green
//                         case 'Projectgebied.geojson':
//                             return createPolygonStyle(color = [0, 0, 0], transparancy = 0)//black
//                     }

//                     // Determine the geometry type of the feature
//                     const geometryType = feature.getGeometry().getType();
//                     // Check if the feature is a point and apply circle styling
//                     if ((geometryType === 'Point' || geometryType === 'MultiPoint') && file.name !== 'Start_Eind_Punt.geojson') {
//                         return createCircleStyle(color);
//                     }
//                     // Check if the feature is a point and apply circle styling
//                     if ((geometryType === 'Polygon' || geometryType === 'MultiPolygon') && file.name !== 'Projectgebied.geojson') {
//                         return createPolygonStyle(color);
//                     }
//                     // Check if the feature is a point and apply circle styling
//                     if ((geometryType === 'LineString' || geometryType === 'MultiLineString') && file.name !== 'Trace_Doorlooptijd_smooth.geojson' && file.name !== 'Trace_Kosten_smooth.geojson' && file.name !== 'Trace_Lengte_smooth.geojson') {
//                         return createLineStyle(color);
//                     }

//                 }

//             });

//             map.addLayer(vectorLayer);

//             // Calculate the extent of the features
//             const extent = vectorSource.getExtent();

//             // Check if the extent is valid (not infinite)
//             if (extent && !ol.extent.isEmpty(extent)) {
//                 // Zoom to the extent of the layer with animation
//                 map.getView().fit(extent, {
//                     duration: 1000, // Animation duration in milliseconds
//                     padding: [50, 50, 50, 50] // Padding around the extent [top, right, bottom, left] in pixels
//                 });
//             }

//         };
//         reader.readAsText(file);
//     };

//     for (let i = 0; i < files.length; i++) {
//         processFile(files[i]);
//     }

// });

var layerColors = {};

// Separate styling function
function getFeatureStyle(file, feature) {
    let layerName = file.name;
    let color;

    // Check if the layer already has a color assigned
    if (layerColors[layerName]) {
        color = layerColors[layerName];
    } else {
        // Assign a new color and store it for the layer
        color = getRandomColor();
        layerColors[layerName] = color;
    }

    switch (file.name) {
        case 'klic.geojson': // styling should be changed based on gml id 
            return klicStyle(feature);
        case 'Start_Eind_Punt.geojson':
            return createCircleStyle([255, 0, 0], 1.0);
        case "Doorlooptijd.geojson":
        case 'Trace_Doorlooptijd_smooth.geojson':
            return createLineStyle([0, 0, 255], 1.0); // blue
        case 'Kosten.geojson':
        case 'Trace_Kosten_smooth.geojson':
            return createLineStyle([255, 0, 0], 1.0); // red
        case 'Lengte.geojson':
        case 'Trace_Lengte_smooth.geojson':
            return createLineStyle([0, 255, 0], 1.0); // Green
        case 'Projectgebied.geojson':
            return createPolygonStyle([0, 0, 0], 0); //black
        default:
            const geometryType = feature.getGeometry().getType();
            if (geometryType === 'Point' || geometryType === 'MultiPoint') {
                return createCircleStyle(color);
            } else if (geometryType === 'Polygon' || geometryType === 'MultiPolygon') {
                return createPolygonStyle(color);
            } else if (geometryType === 'LineString' || geometryType === 'MultiLineString') {
                return createLineStyle(color);
            }
    }
}

const layerGroups = {}; // Initialize an object to hold layer groups

document.getElementById('jsonFileInput').addEventListener('change', function (event) {
    const files = event.target.files;

    const processFile = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function (e) {
                const features = new ol.format.GeoJSON().readFeatures(e.target.result, {
                    dataProjection: 'EPSG:29882',
                    featureProjection: map.getView().getProjection()
                });

                const vectorSource = new ol.source.Vector({ features: features });
                const vectorLayer = new ol.layer.Vector({
                    source: vectorSource,
                    title: file.name.split('.')[0],
                    style: function (feature) {
                        // Assuming getFeatureStyle is defined elsewhere
                        return getFeatureStyle(file, feature, vectorSource);
                    }
                });

                // Determine the group name (customize this logic as needed)
                const fileName = file.name.split('.')[0]; // Example: Use the part of the file name before the first dot
                if (fileName.includes('Doorlooptijd')) {
                    groupName = 'Trace Doorlooptijd'; // Example: Group all files with 'Trace' in the name
                }
                else if (fileName.includes('Kosten')) {
                    groupName = 'Trace Kosten'; // Example: Group all files with 'Trace' in the name
                }
                else if (fileName.includes('Lengte')) {
                    groupName = 'Trace Lengte'; // Example: Group all files with 'Trace' in the name
                }
                else {
                    groupName = 'Other';
                }

                if (!layerGroups[groupName]) {
                    // If the group doesn't exist, create it
                    layerGroups[groupName] = new ol.layer.Group({
                        layers: [],
                        title: groupName // Optional: Set a title for the group
                    });
                }
                layerGroups[groupName].getLayers().push(vectorLayer); // Add the layer to the group
                resolve(); // Resolve the promise after adding the layer to the group
            };
            reader.onerror = reject; // Reject the promise on read error
            reader.readAsText(file);
        });
    };

    // Process all files and wait for all to complete
    Promise.all(Array.from(files).map(file => processFile(file))).then(() => {
        // Once all files are processed, add the groups to the map
        Object.values(layerGroups).forEach(group => map.addLayer(group));
        // Calculate the combined extent of all vector layers
        let combinedExtent = ol.extent.createEmpty();
        Object.values(layerGroups).forEach(group => {
            group.getLayers().forEach(layer => {
                if (layer instanceof ol.layer.Vector) {
                    ol.extent.extend(combinedExtent, layer.getSource().getExtent());
                }
            });
        });

        // Check if the extent is valid before zooming
        if (isFinite(combinedExtent[0]) && isFinite(combinedExtent[1]) && isFinite(combinedExtent[2]) && isFinite(combinedExtent[3])) {
            // Zoom to the combined extent with a padding
            map.getView().fit(combinedExtent, { padding: [50, 50, 50, 50], duration: 1000 });
        }
    }).catch(error => console.error("Error processing files:", error));
});


// Add a layer switcher to the map
var layerswitcher = new ol.control.LayerSwitcher({
    mouseover: true,
    trash: true,

});
map.addControl(layerswitcher);



// // add a scalebar
// var scaleControl = new ol.control.Scale({
//     bar: true,
//     minWidth: 200,
// });


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






