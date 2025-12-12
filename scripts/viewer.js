
// ----------------------------- SET PROJECTION -----------------------------

var projectionExtent = [-285401.9200000018, 71093.05539999902, 546906.944600001, 903401.9200000018];
var projectProjection = new ol.proj.Projection({ code: 'EPSG:28992', units: 'm', extent: projectionExtent, origin: [-285401.9200000018, 903401.9200000018] });

// Geldigheidsgebied van het tiling schema in RD-coördinaten:
var projectionExtent = [-285401.92, 22598.08, 595401.9199999999, 903401.9199999999];
var projection = new ol.proj.Projection({ code: 'EPSG:28992', units: 'm', extent: projectionExtent });
// Resoluties (pixels per meter) van de zoomniveaus:
var resolutions = [3440.640, 1720.320, 860.160, 430.080, 215.040, 107.520, 53.760, 26.880, 13.440, 6.720, 3.360, 1.680, 0.840, 0.420, 0.210];
var size = ol.extent.getWidth(projectionExtent) / 256;
// Er zijn 15 (0 tot 14) zoomniveaus beschikbaar van de WMTS-service voor de BRT-Achtergrondkaart:
var matrixIds = new Array(15);
for (var z = 0; z < 15; ++z) {
    matrixIds[z] = 'EPSG:28992:' + z;
}

// Define the view with the correct projection
var view = new ol.View({
    projection: projectProjection,
    center: [195000, 463000], // Center on a point in the Netherlands, adjust as needed
    zoom: 3
});

// ----------------------------- CREATE MAP AND BASELAYERS -----------------------------

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

// TODO add more layers and be able to click the attributes
var bgtLayer = new ol.layer.Tile({
    title: 'BGT',
    type: 'base',
    visible: false,
    source: new ol.source.WMTS({
        attributions: 'Kaartgegevens: &copy; <a href="https://www.kadaster.nl">Kadaster</a>',
        url: 'https://service.pdok.nl/lv/bgt/wmts/v1_0?',
        layer: 'standaardvisualisatie',
        matrixSet: 'EPSG:28992',
        format: 'application/json',
        projection: projection,
        tileGrid: new ol.tilegrid.WMTS({
            origin: ol.extent.getTopLeft(projectionExtent),
            resolutions: resolutions,
            matrixIds: matrixIds
        }),
        style: 'default',
        wrapX: false
    })
})

var brtLayer = new ol.layer.Tile({
    title: 'BRT',
    type: 'base',
    visible: false,
    source: new ol.source.WMTS({
        attributions: 'Kaartgegevens: &copy; <a href="https://www.kadaster.nl">Kadaster</a>',
        url: 'https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0?',
        layer: 'standaard',
        matrixSet: 'EPSG:28992',
        format: 'image/png',
        projection: projection,
        tileGrid: new ol.tilegrid.WMTS({
            origin: ol.extent.getTopLeft(projectionExtent),
            resolutions: resolutions,
            matrixIds: matrixIds
        }),
        style: 'default',
        wrapX: false
    })
})

var osmLayer = new ol.layer.Tile({
    title: 'OpenStreetMap',
    type: 'base',
    visible: false,
    source: new ol.source.OSM(),
});


// create basemap layer group
var baseLayerGroup = new ol.layer.Group({
    title: "Base maps",
    layers: [rdNewLayer, Luchtfoto, bgtLayer, osmLayer, brtLayer]
});


// create the map and add the layers
const map = new ol.Map({
    target: "viewer-map",
    view: view,
    layers: [baseLayerGroup]
});

// ----------------------------- CREATE LEGEND -----------------------------

// Define a new legend
var legend = new ol.legend.Legend({
    title: 'Legenda',
    margin: 5,
});
var legendControl = new ol.control.Legend({
    legend: legend,
    collapsible: true,
    collapsed: true,
});
map.addControl(legendControl);



// ----------------------------- STYLING FUNCTIONS-----------------------------
function OrientatiemeldingSyle(feature) {
    const kleurField = feature.get('kleur');
    const styles = {
        'Geel': { color: 'rgb(255, 255, 122, 0.7)', width: 2 },
        'Groen': { color: 'rgb(153, 255, 127, 0.7)', width: 2 },
        'Oranje': { color: 'rgb(255, 154, 66, 0.7)', width: 2 },
        'Rood': { color: 'rgb(255, 80, 80, 0.7)', width: 2 }
    };

    let selectedStyle = { color: '#808080', width: 2 }; // Default style

    if (kleurField) {
        for (const [key, style] of Object.entries(styles)) {
            if (kleurField.includes(key.slice(-2))) {
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


// styling functions for features https://wetten.overheid.nl/BWBR0027409/2017-02-15 Kleurgebruik per thema
function klicStyle(feature) {
    const gmlId = feature.get('gml_id');
    const thema = feature.get('thema');
    const styles = {
        'datatransport': { color: 'rgba(0, 255, 0, 1.0)', width: 2 },
        'ElektriciteitskabelMs': { color: 'rgba(200, 0, 0, 1.0)', width: 2 },
        'ElektriciteitskabelLs': { color: 'rgba(150, 0, 0, 1.0)', width: 2 },
        'OlieGasChemicalienPijpleidingLD': { color: 'rgba(255, 215, 80, 1.0)', width: 2 },
        'OlieGasChemicalienPijpleidingHD': { color: 'rgba(255, 175, 60, 1.0)', width: 2 },
        'buisleidingGevaarlijkeInhoud': { color: 'rgba(255, 127, 0, 1.0)', width: 2 },
        'gasHogeDruk': { color: 'rgba(255, 175, 60, 1.0)', width: 2 },
        'gasLageDruk': { color: 'rgba(255, 215, 80, 1.0)', width: 2 },
        'hoogspanning': { color: 'rgba(255, 0, 0, 1.0)', width: 2 },
        'laagspanning': { color: 'rgba(150, 0, 0, 1.0)', width: 2 },
        'landelijkHoogspanningsnet': { color: 'rgba(255, 0, 0, 1.0)', width: 2 },
        'middenspanning': { color: 'rgba(200, 0, 0, 1.0)', width: 2 },
        'overig': { color: 'rgba(0, 0, 0, 1.0)', width: 2 },
        'rioolOnderOverOfOnderdruk': { color: 'rgba(128, 0, 128, 1.0)', width: 2 },
        'rioolVrijverval': { color: 'rgba(186, 56, 168, 1.0)', width: 2 },
        'water': { color: 'rgba(0, 0, 255, 1.0)', width: 2 },
    };

    let selectedStyle = { color: '#808080', width: 2 }; // Default style

    if (gmlId) {
        for (const [key, style] of Object.entries(styles)) {
            if (gmlId.includes(key.replace(/Ms|Ls|LD|HD$/, '')) && gmlId.includes(key.slice(-2))) {
                selectedStyle = style;
                break;
            }
        }
    }
    else if (thema) {
        for (const [key, style] of Object.entries(styles)) {
            if (thema.includes(key)) {
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

function createPolygonStyle(color_rgb_list = [0, 0, 255], transperancy = 0.3, width = 2) {
    rgba_color_outline = `rgba(${color_rgb_list[0]}, ${color_rgb_list[1]}, ${color_rgb_list[2]}, 1)`
    rgba_color_fill = `rgba(${color_rgb_list[0]}, ${color_rgb_list[1]}, ${color_rgb_list[2]}, ${transperancy})`
    return new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: rgba_color_outline,
            width: width,
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

    switch (true) {
        // Input features styling
        case file.name === 'NoGoZones.geojson':
            return createPolygonStyle([255, 0, 0], 0.3, 1); // red
        case file.name === 'Start_Eind_Punt.geojson':
            return createCircleStyle([255, 0, 0], 1.0); //red
        case file.name === 'Projectgebied.geojson':
            return createPolygonStyle([0, 0, 0], 0); // black
        case file.name === 'Hulplijnen.geojson':
            return createLineStyle([211, 211, 211], 1.0); // grey

        //Klic styling
        case file.name === 'klic.geojson': // styling should be changed based on gml id / theme
            return klicStyle(feature);

        // orientatiemelding styling
        case file.name.includes('Orientatiemelding'):
            return OrientatiemeldingSyle(feature);

        // trace styling
        case file.name === "Doorlooptijd.geojson":
        case file.name === 'Trace_Doorlooptijd_smooth.geojson':
            return createLineStyle([0, 255, 0], 1.0); // green
        case file.name === 'Kosten.geojson':
        case file.name === 'Trace_Kosten_smooth.geojson':
            return createLineStyle([255, 0, 0], 1.0); // red
        case file.name === 'Lengte.geojson':
        case file.name === 'Trace_Lengte_smooth.geojson':
            return createLineStyle([0, 0, 255], 1.0); // blue
        case file.name === 'trace.geojson':
            return createLineStyle([255, 0, 0], 1.0); // red

        // boorlijn styling
        case file.name.includes('boorlijn'):
            return createLineStyle([0, 0, 0], 3.0); // black

        // ongusntig zone styling
        case file.name === 'Ongunstig_zone.geojson':
            return createPolygonStyle([255, 165, 0], 0.3, 1); // orange

        //BGT styling
        case file.name === 'Wegdeel_bgt.geojson':
            return createPolygonStyle([211, 211, 211], 0.3, 1); // grey
        case file.name === 'Waterdeel_bgt.geojson':
            return createPolygonStyle([0, 0, 139], 0.3, 1); // Blue
        case file.name === 'VegetatieObject_bgt.geojson':
            return createCircleStyle([34, 139, 34], 0.3, 1); // Green
        case file.name === 'Scheiding_bgt.geojson':
            return createPolygonStyle([0, 0, 0,], 0.3, 1); // black
        case file.name === 'Pand_bgt.geojson':
            return createPolygonStyle([139, 0, 0], 0.3, 1); // red
        case file.name === 'OverigBouwwerk_bgt.geojson':
            return createPolygonStyle([255, 102, 102], 0.3, 1); // light red
        case file.name === 'Overbruggingsdeel_bgt.geojson':
            return createPolygonStyle([169, 169, 169], 0.3, 1); // Steel Blue
        case file.name === 'OndersteunendWegdeel_bgt.geojson':
            return createPolygonStyle([210, 180, 140], 0.3, 1); // Tan
        case file.name === 'OndersteunendWaterdeel_bgt.geojson':
            return createPolygonStyle([0, 191, 255], 0.3, 1); // Deep Sky Blue
        case file.name === 'OnbegroeidTerreindeel_bgt.geojson':
            return createPolygonStyle([244, 164, 96], 0.3, 1); // Sandy Brown
        case file.name === 'Kunstwerkdeel_bgt.geojson':
            return createPolygonStyle([220, 20, 60], 0.3, 1); // Crimson
        case file.name === 'BegroeidTerreindeel_bgt.geojson':
            return createPolygonStyle([50, 205, 50], 0.3, 1); // Lime Green

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
const groupsToTurnOnByDefault = [
    'Trace Kosten',
    'Trace Lengte',
    'Trace Doorlooptijd',
    'Trace',
];

// ----------------------------- ADD GEOJSON FOLDER TO MAP -----------------------------

document.getElementById('jsonFileInput').addEventListener('change', function (event) {
    const files = event.target.files;

    // Filter out only GeoJSON files
    const geojsonFiles = Array.from(files).filter(file => file.name.endsWith('.geojson'));

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
                        return getFeatureStyle(file, feature, vectorSource);
                    }
                });

                // Assign layers to groups based on file name
                const fileName = file.name.split('.')[0].toLowerCase();
                let groupName;

                // Assign group names based on file name (same logic as before)
                if ((fileName.includes('doorlooptijd') && fileName.includes('kruising')) || (fileName.includes('doorlooptijd') && fileName.includes('nabijgelegen'))) {
                    groupName = 'Kruisingen Trace Doorlooptijd';
                }
                else if (fileName.includes('bgt')) {
                    groupName = 'BGT';
                }
                else if (fileName.includes('orientatiemelding')) {
                    groupName = 'Orientatiemelding Qterra';
                }
                else if (fileName.includes('kosten') && fileName.includes('kruising') || (fileName.includes('kosten') && fileName.includes('nabijgelegen'))) {
                    groupName = 'Kruisingen Trace kosten';
                }
                else if (fileName.includes('lengte') && fileName.includes('kruising') || (fileName.includes('lengte') && fileName.includes('nabijgelegen'))) {
                    groupName = 'Kruisingen Trace lengte';
                }
                else if (fileName.includes('doorlooptijd')) {
                    groupName = 'Trace Doorlooptijd';
                }
                else if (fileName.includes('kosten')) {
                    groupName = 'Trace Kosten';
                }
                else if (fileName.includes('lengte')) {
                    groupName = 'Trace Lengte';
                }
                else if (fileName.includes('boorlijnen') || fileName.includes('hulplijnen') || fileName.includes('nogozones') || fileName.includes('projectgebied') || fileName.includes('start_eind_punt')) {
                    groupName = 'Ingetekende Features';
                }
                else if (fileName.includes('ongunstig_zone')) {
                    groupName = 'Ongunstig Zone';
                }
                else if (fileName.includes('klic')) {
                    groupName = 'Klic';
                }
                else if ((fileName.includes('kruising')) || fileName.includes('nabijgelegen')) {
                    groupName = 'Kruisingen';
                }
                else if ((fileName.includes('trace'))) {
                    groupName = 'Trace';
                }
                else {
                    groupName = 'Overig';
                }

                if (!layerGroups[groupName]) {
                    // If the group doesn't exist, create it
                    layerGroups[groupName] = new ol.layer.Group({
                        layers: [],
                        title: groupName // Optional: Set a title for the group
                    });
                }

                // Insert the layer at the first position in the group
                layerGroups[groupName].getLayers().insertAt(0, vectorLayer);

                // // Set the default visibility for the layer based on predefined groups
                // if (groupsToTurnOnByDefault.includes(groupName)) {
                //     vectorLayer.setVisible(true);  // Turn the layer on by default
                // } else {
                //     vectorLayer.setVisible(false);  // Keep it off by default
                // }

                // Set the default visibility for the group
                if (groupsToTurnOnByDefault.includes(groupName)) {
                    layerGroups[groupName].setVisible(true);  // Turn the group on by default
                } else {
                    layerGroups[groupName].setVisible(false);  // Turn the group off by default
                }

                resolve(); // Resolve the promise after adding the layer to the group
            };
            reader.onerror = reject; // Reject the promise on read error
            reader.readAsText(file);
        });
    };

    // Process all GeoJSON files in the folder
    const filePromises = geojsonFiles.map(processFile);

    // Once all files are processed, add the groups to the map
    Promise.all(filePromises)
        .then(() => {
            //Once all files are processed, add the groups to the map
            // Object.values(layerGroups).forEach(group => map.addLayer(group));

            // Once all files are processed, add the groups to the map in the specific order
            const groupOrder = [
                'Ingetekende Features',
                'BGT',
                'Ongunstig Zone',
                'Klic',
                'Orientatiemelding Qterra',
                'Trace Kosten',
                'Trace Lengte',
                'Trace Doorlooptijd',
                'Trace',
                'Kruisingen Trace Doorlooptijd',
                'Kruisingen Trace kosten',
                'Kruisingen Trace lengte',
                'Kruisingen',
                'Overig'
            ];

            const groupOrderStandAlone = [
                'Ingetekende Features',
                'BGT',
                'Ongunstig Zone',
                'Orientatiemelding Qterra',
                'Klic',
                'Trace',
                'Kruisingen',
                'Overig'
            ]

            // Add groups to the map in the correct order if they exist in layerGroups
            groupOrder.forEach(groupName => {
                if (layerGroups[groupName]) {
                    map.addLayer(layerGroups[groupName]);
                } else {
                    console.log(`Group '${groupName}' not found, skipping.`);
                }
            });


            // Add layers in the group to the legend
            groupOrder.forEach(groupName => {
                if (layerGroups[groupName]) {
                    legend.addItem({ title: groupName, typeGeom: null, style: null });
                    layerGroups[groupName].getLayers().forEach(layer => {
                        const layerTitle = layer.get('title').replaceAll('_', ' ');
                        const layerStyle = layer.getStyle();
                        const addedThemes = new Set(); // Set to store unique klic themes

                        // Check if the layer has a title and style
                        if (layerTitle && layerStyle) {
                            const geometryType = getGeometryTypeFromLayer(layer)// get the geometry for unique styling icon

                            // If it's the 'klic' group, handle the custom styling for each feature theme
                            if (groupName === 'Klic') {
                                const source = layer.getSource(); // Get the source of the vector layer
                                const features = source.getFeatures(); // Get all features in the layer
                                features.forEach(feature => {
                                    console.log(feature);
                                    const theme = feature.get('thema'); // Get the 'thema' attribute
                                    // Only add the theme if it hasn't been added yet
                                    if (theme && !addedThemes.has(theme)) {
                                        addedThemes.add(theme);
                                        //retrieve klic stylee from the style function
                                        const featureStyle = klicStyle(feature)
                                        // Now we add the theme and style to the legend
                                        legend.addItem({
                                            title: theme,
                                            typeGeom: geometryType, // Dynamically detect geometry type
                                            style: featureStyle
                                        });
                                    }
                                });
                            }
                            else if (groupName === 'Orientatiemelding Qterra') {
                                const source = layer.getSource(); // Get the source of the vector layer
                                const features = source.getFeatures(); // Get all features in the layer
                                features.forEach(feature => {
                                    const theme = feature.get('kleur'); // Get the 'thema' attribute
                                    // Only add the theme if it hasn't been added yet
                                    if (theme && !addedThemes.has(theme)) {
                                        addedThemes.add(theme);
                                        //retrieve klic stylee from the style function
                                        const featureStyle = OrientatiemeldingSyle(feature)
                                        // Now we add the theme and style to the legend
                                        legend.addItem({
                                            title: theme,
                                            typeGeom: geometryType, // Dynamically detect geometry type
                                            style: featureStyle
                                        });
                                    }
                                });
                            }
                            else {
                                // For non-"klic" groups, add items normally
                                legend.addItem({
                                    title: layerTitle,
                                    typeGeom: geometryType,
                                    style: layerStyle,
                                });
                            }

                        } else {
                            console.log('Layer missing title or style:', layer);
                        }
                    });
                }
            });


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


// Function to get geometry type from the first feature in the layer
function getGeometryTypeFromLayer(layer) {
    const source = layer.getSource(); // Get the source of the vector layer
    const features = source.getFeatures(); // Get all features in the layer

    if (features.length > 0) {
        const geometry = features[0].getGeometry(); // Get geometry of the first feature
        if (geometry) {
            // Dynamically return the geometry type
            if (geometry instanceof ol.geom.Point) {
                return 'Point';
            } else if (geometry instanceof ol.geom.LineString) {
                return 'LineString';
            } else if (geometry instanceof ol.geom.Polygon) {
                return 'Polygon';
            }
            else if (geometry instanceof ol.geom.MultiPoint) {
                return 'MultiPoint';
            }
            else if (geometry instanceof ol.geom.MultiLineString) {
                return 'MultiLineString';
            }
            else if (geometry instanceof ol.geom.MultiPolygon) {
                return 'MultiPolygon';
            }
        }
    }

    return 'Unknown'; // Default if no valid geometry is found
}

// ----------------------------- ADD LAYERSWITCHER -----------------------------

// Add a layer switcher to the map
var layerswitcher = new ol.control.LayerSwitcher({
    mouseover: true,
    trash: true,

});
map.addControl(layerswitcher);

// ----------------------------- VIEW FEATURES ATTRIBUTES -----------------------------

// click on map and show features
const popup = document.getElementById('popup');
const popupCloser = document.getElementById('popup-closer');
const popupContent = document.getElementById('popup-content');


popupCloser.onclick = function (event) {
    event.preventDefault(); // Prevent default link behavior
    event.stopPropagation(); // Stop the click event from propagating to the map
    popup.style.display = 'none';
    popupCloser.blur();
    return false;
};

map.on('singleclick', function (evt) {
    // Check if the click occurred inside the popup or its close button
    const target = evt.originalEvent.target;
    if (popup.contains(target)) {
        return; // Exit if the click originated from the popup or its children
    }

    let layerName = '';
    const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
        if (layer) {
            layerName = layer.get('title') || 'Unnamed Layer'; // Assuming layers have a 'title' property
        }
        return feature;
    });

    if (feature) {
        const coordinates = evt.coordinate;
        const properties = feature.getProperties();
        delete properties.geometry;

        const propertiesStr = Object.keys(properties)
            .map(key => `${key}: ${properties[key]}`)
            .join('<br>');

        // Add layer name as the title in the popup
        const layerTitle = `<strong>${layerName}</strong><br>`;
        popupContent.innerHTML = layerTitle + propertiesStr;

        popup.style.display = 'block';

        const overlay = new ol.Overlay({
            element: popup,
            positioning: 'bottom-center',
            stopEvent: false,
            offset: [0, -10],
        });

        map.addOverlay(overlay);
        overlay.setPosition(coordinates);
    } else {
        popup.style.display = 'none';
    }
});

// ----------------------------- DOUBLE KLIC TO GOOGLE STREETVIEW -----------------------------

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


// add project data
// Get project ID from URL query
const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get("project_id");

if (projectId) {
  const token = localStorage.getItem("accessToken");

  fetch(`https://sue-fastapi.onrender.com/projects/${projectId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch project");
      return res.json();
    })
    .then((data) => {
      const traces = data.traces || [];

      traces.forEach((trace) => {
        if (!trace.geometry) return; // Skip traces without geometry

        const features = new ol.format.GeoJSON().readFeatures({
          type: "FeatureCollection",
          crs: { type: "name", properties: { name: "EPSG:28992" } },
          features: [
            {
              type: "Feature",
              id: trace.id,
              geometry: trace.geometry,
              properties: {
                name: trace.name,
                description: trace.description || "",
              },
            },
          ],
        }, {
          dataProjection: "EPSG:28992",
          featureProjection: map.getView().getProjection()
        });

        const vectorSource = new ol.source.Vector({ features });
        const vectorLayer = new ol.layer.Vector({
          source: vectorSource,
          title: trace.name,
          style: (feature) => getFeatureStyle(trace, feature, vectorSource)
        });

        // Add to default "Project Traces" group
        if (!layerGroups["Project Traces"]) {
          layerGroups["Project Traces"] = new ol.layer.Group({
            layers: [],
            title: "Project Traces",
          });
          map.addLayer(layerGroups["Project Traces"]);
        }
        layerGroups["Project Traces"].getLayers().push(vectorLayer);
      });

      // Zoom to all loaded traces
      let combinedExtent = ol.extent.createEmpty();
      Object.values(layerGroups).forEach(group => {
        group.getLayers().forEach(layer => {
          if (layer instanceof ol.layer.Vector) {
            ol.extent.extend(combinedExtent, layer.getSource().getExtent());
          }
        });
      });
      if (isFinite(combinedExtent[0])) {
        map.getView().fit(combinedExtent, { padding: [50,50,50,50], duration: 1000 });
      }
    })
    .catch((err) => console.error("Error loading project traces:", err));
}







