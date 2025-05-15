var toggleButton = document.getElementById("toggleButton");
var drawHulplijn = document.getElementById("drawHulplijn");

toggleButton.addEventListener("click", function () {
    if (drawHulplijn.style.display === "none") {
        drawHulplijn.style.display = "block";
    } else {
        drawHulplijn.style.display = "none";
    }
});

// Initialize the map

// var tileLayer = L.tileLayer(
//     "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
//     {
//         attribution:
//             '&copy; <a href="https://www.openstreetmap.org/copyright">',
//     }
// ).addTo(map);

var RD = new L.Proj.CRS(
    "EPSG:28992",
    "+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +towgs84=565.2369,50.0087,465.658,-0.406857330322398,0.350732676542563,-1.8703473836068,4.0812 +no_defs",
    {
        origin: [-285401.92, 903401.92],
        resolutions: [
            // Levels of Detail: 17
            3251.206502413005, 1625.6032512065026, 812.8016256032513,
            406.40081280162565, 203.20040640081282, 101.60020320040641,
            50.800101600203206, 25.400050800101603, 12.700025400050801,
            6.350012700025401, 3.1750063500127004, 1.5875031750063502,
            0.7937515875031751, 0.39687579375158755, 0.19843789687579377,
            0.09921894843789688, 0.04960947421894844,
        ],
    }
);

var defaultBaseMap = L.tileLayer(
    "https://services.arcgisonline.nl/arcgis/rest/services/Basiskaarten/Topo/MapServer/tile/{z}/{y}/{x}",
    {
        attribution: 'Map data &copy; <a href="https://www.arcgis.com/">ArcGIS</a>',
    }
);

var secondBaseMap = L.tileLayer(
    "https://services.arcgisonline.nl/arcgis/rest/services/Luchtfoto/Luchtfoto/MapServer/tile/{z}/{y}/{x}",
    {
        attribution: 'Map data &copy; <a href="https://www.arcgis.com/">ArcGIS</a>',
    }
);

var map = L.map("map", {
    layers: [defaultBaseMap],
    crs: RD,
    maxZoom: 14.4,
}).setView([52.2354, 5.3751], 3);

var baseMaps = {
    Topo: defaultBaseMap,
    Luchtfoto: secondBaseMap,
};

L.control.layers(baseMaps).addTo(map);

// add search bar
L.Control.geocoder().addTo(map);

// FeatureGroup to store editable layers
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

// Initialize the draw control and pass it the FeatureGroup of editable layers
var drawControl = new L.Control.Draw({
    edit: {
        featureGroup: drawnItems,
    },
    draw: false, // Disable default draw tools
});
map.addControl(drawControl);

// Add created layers to the map
map.on(L.Draw.Event.CREATED, function (event) {
    var layer = event.layer;
    drawnItems.addLayer(layer);
    layer.type = currentDrawingType; // Set type to distinguish different drawing types
});

var redIcon = new L.Icon({
    iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

var currentDrawingType = null;
var drawControlProjectArea = new L.Draw.Polygon(map, {
    shapeOptions: {
        color: "blue",
        fill: false,
    },
});

var drawControlStartEndPoint = new L.Draw.Marker(map, {
    icon: redIcon,
});
var drawControlNoGoZone = new L.Draw.Polygon(map, {
    shapeOptions: {
        color: "red",
    },
});
var drawControlHulplijn = new L.Draw.Polyline(map, {
    shapeOptions: {
        color: "orange",
    },
});

var drawControlBoorlijn = new L.Draw.Polyline(map, {
    shapeOptions: {
        color: "black",
    },
});

var currentDrawControl = null;

document
    .getElementById("drawProjectArea")
    .addEventListener("click", function () {
        if (currentDrawControl) {
            currentDrawControl.disable();
        }
        currentDrawingType = "projectgebiedWKT";
        drawControlProjectArea.enable();
        currentDrawControl = drawControlProjectArea;
    });

document
    .getElementById("drawStartEndPoint")
    .addEventListener("click", function () {
        if (currentDrawControl) {
            currentDrawControl.disable();
        }
        currentDrawingType = "startEindPuntWKT";
        drawControlStartEndPoint.enable();
        currentDrawControl = drawControlStartEndPoint;
    });

document.getElementById("drawNoGoZone").addEventListener("click", function () {
    if (currentDrawControl) {
        currentDrawControl.disable();
    }
    currentDrawingType = "nogoZonesWKT";
    drawControlNoGoZone.enable();
    currentDrawControl = drawControlNoGoZone;
});

document.getElementById("drawHulplijn").addEventListener("click", function () {
    if (currentDrawControl) {
        currentDrawControl.disable();
    }
    currentDrawingType = "hulplijnenWKT";
    drawControlHulplijn.enable();
    currentDrawControl = drawControlHulplijn;
});

document.getElementById("drawBoorlijn").addEventListener("click", function () {
    if (currentDrawControl) {
        currentDrawControl.disable();
    }
    currentDrawingType = "boorlijnenWKT";
    drawControlBoorlijn.enable();
    currentDrawControl = drawControlBoorlijn;
});

// Coordinate transformation
proj4.defs([
    ["EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs"],
    // ['EPSG:28992', '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +towgs84=565.4171,50.3319,465.5524,0.398957,0.343988,-1.8774,4.0725 +no_defs'],
    [
        "EPSG:28992",
        "+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +towgs84=565.2369,50.0087,465.658,-0.406857330322398,0.350732676542563,-1.8703473836068,4.0812 +no_defs",
    ],
]);

function toRDNew(lat, lng) {
    return proj4("EPSG:4326", "EPSG:28992", [lng, lat]);
}

// Function to convert coordinates to WKT format in RD New
function toWKT(layer) {
    if (layer instanceof L.Polygon) {
        var coords = layer
            .getLatLngs()[0]
            .map(function (latLng) {
                var rdCoords = toRDNew(latLng.lat, latLng.lng);
                return rdCoords[0] + " " + rdCoords[1];
            })
            .join(", ");
        // Ensure the polygon is closed
        coords += ", " + coords.split(", ")[0];
        return "POLYGON ((" + coords + "))";
    } else if (layer instanceof L.Polyline) {
        var coords = layer
            .getLatLngs()
            .map(function (latLng) {
                var rdCoords = toRDNew(latLng.lat, latLng.lng);
                return rdCoords[0] + " " + rdCoords[1];
            })
            .join(", ");
        return "LINESTRING (" + coords + ")";
    } else if (layer instanceof L.Marker) {
        var rdCoords = toRDNew(layer.getLatLng().lat, layer.getLatLng().lng);
        return "POINT (" + rdCoords[0] + " " + rdCoords[1] + ")";
    }
}

// Function to download GeoJSON
function downloadGeoJSON() {
    var projectgebiedWKT = null;
    var startEindPuntWKT = [];
    var nogoZonesWKT = [];
    var hulplijnenWKT = [];
    var boorlijnenWKT = [];

    drawnItems.eachLayer(function (layer) {
        var wkt = toWKT(layer);
        if (layer.type === "projectgebiedWKT") {
            projectgebiedWKT = wkt;
        } else if (layer.type === "startEindPuntWKT") {
            startEindPuntWKT.push(wkt);
        } else if (layer.type === "nogoZonesWKT") {
            nogoZonesWKT.push(wkt);
        } else if (layer.type === "hulplijnenWKT") {
            hulplijnenWKT.push(wkt);
        } else if (layer.type === "boorlijnenWKT") {
            boorlijnenWKT.push(wkt);
        }
    });

    // Validate if necessary layers exist
    if (!projectgebiedWKT || startEindPuntWKT.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Fout',
            text: 'Het tekenen van een projectgebied en op zijn minst één start en één eindpunt is verplicht.',
            confirmButtonText: 'Ok'
        });
        return;
    }

    // Ask for project name via SweetAlert modal
    Swal.fire({
        title: 'Projectinformatie invoeren',
        html: `
        <style>
            .form-container {
                display: flex;
                flex-direction: column;
                align-items: stretch;
                max-width: 600px;
                margin: 0 auto;
            }
            .form-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 10px;
            }
            .form-row label {
                flex: 1;
                margin-right: 10px;
                text-align: center;
            }
            .form-row input[type="range"] {
                flex: 2;
                margin: 0 10px;
            }
            .form-row span {
                width: 40px;
                text-align: center;
            }
            .swal2-input {
                width: 100%;
                margin-bottom: 10px;
                padding: 8px;
                box-sizing: border-box;
            }
        </style>
        <div class="form-container">
            <div class="form-row">
                <label for="projectName">Projectnaam:</label>
            </div>
            <div class="form-row">
                <input id="projectName" class="swal2-input" placeholder="Projectnaam...">
            </div>
            <div class="form-row">
                <label for="projectNumber">Projectnummer:</label>
            </div>
            <div class="form-row">
                <input id="projectNumber" class="swal2-input" placeholder="Projectnummer...">
            </div>
            <div class="form-row">
                <label for="klicFile">KLIC-bestand:</label>
                </div>
                <div class="form-row">
                <select id="klicFile" class="swal2-input">
                    <option value="zelf opsturen">Zelf opsturen</option>
                    <option value="aanvragen">Aanvragen</option>
                </select>
                </div>
            </div>

            <div>
            <div class="form-row">
                <label for="geulbreedte">Geulbreedte (max 10 meter):</label>
            </div>
            <div class="form-row">
                <input id="geulbreedte" type="number" class="swal2-input" step="0.1" max="10" value="0.8">
            </div>
            
            <div class="form-row">
                <label for="geslotenVerharding">Gesloten verharding:</label>
                <input id="geslotenVerharding" type="range" min="0" max="100" value="34" step="1" 
                    oninput="document.getElementById('geslotenVerhardingValue').textContent = this.value">
                <span id="geslotenVerhardingValue">34</span>%
            </div>
            <div class="form-row">
                <label for="openVerharding">Open verharding:</label>
                <input id="openVerharding" type="range" min="0" max="100" value="15" step="1" 
                    oninput="document.getElementById('openVerhardingValue').textContent = this.value">
                <span id="openVerhardingValue">15</span>%
            </div>
            <div class="form-row">
                <label for="halfVerhard">Half verhard:</label>
                <input id="halfVerhard" type="range" min="0" max="100" value="10" step="1" 
                    oninput="document.getElementById('halfVerhardValue').textContent = this.value">
                <span id="halfVerhardValue">10</span>%
            </div>
            <div class="form-row">
                <label for="onverhard">Onverhard:</label>
                <input id="onverhard" type="range" min="0" max="100" value="8" step="1" 
                    oninput="document.getElementById('onverhardValue').textContent = this.value">
                <span id="onverhardValue">8</span>%
            </div>
            <div class="form-row">
                <label for="groenvoorzieningLaag">Groenvoorziening (gras/lage beplanting):</label>
                <input id="groenvoorzieningLaag" type="range" min="0" max="100" value="8" step="1" 
                    oninput="document.getElementById('groenvoorzieningLaagValue').textContent = this.value">
                <span id="groenvoorzieningLaagValue">8</span>%
            </div>
            <div class="form-row">
                <label for="groenvoorzieningHoog">Groenvoorziening (heesters/struiken):</label>
                <input id="groenvoorzieningHoog" type="range" min="0" max="100" value="12" step="1" 
                    oninput="document.getElementById('groenvoorzieningHoogValue').textContent = this.value">
                <span id="groenvoorzieningHoogValue">12</span>%
            </div>
            <div class="form-row">
                <label for="groenvoorzieningBos">Groenvoorziening (bebossing):</label>
                <input id="groenvoorzieningBos" type="range" min="0" max="100" value="12" step="1" 
                    oninput="document.getElementById('groenvoorzieningBosValue').textContent = this.value">
                <span id="groenvoorzieningBosValue">12</span>%
            </div>
            <div class="form-row">
                <label for="nogo">Moeilijk Begaanbaar:</label>
                <input id="nogo" type="range" min="0" max="100" value="4" step="1" 
                    oninput="document.getElementById('nogoValue').textContent = this.value">
                <span id="nogoValue">4</span>%
            </div>
            <div class="form-row">
                <label for="klicDrukte">KLIC (kabeldrukte):</label>
                <input id="klicDrukte" type="range" min="0" max="100" value="40" step="1" 
                    oninput="document.getElementById('klicDrukteValue').textContent = this.value">
                <span id="klicDrukteValue">40</span>%
            </div>
           <div class="form-row">
                <label for="waterkering">Waterkering:</label>
                <input id="waterkering" type="range" min="0" max="100" value="45" step="1" 
                    oninput="document.getElementById('waterkeringValue').textContent = this.value">
                <span id="waterkeringValue">45</span>%
            </div>
            <div class="form-row">
                <label for="natura2000">Natura2000:</label>
                <input id="natura2000" type="range" min="0" max="100" value="45" step="1" 
                    oninput="document.getElementById('natura2000Value').textContent = this.value">
                <span id="natura2000Value">45</span>%
            </div>
            <div class="form-row">
                <label for="BuisLeidingGevaarlijkeInhoud">Afstand tot Buisleiding Gevaarlijke inhoud:</label>
                <input id="BuisLeidingGevaarlijkeInhoud" type="range" min="0" max="10" value="0.6" step="0.1" 
                    oninput="document.getElementById('BuisLeidingGevaarlijkeInhoudValue').textContent = this.value">
                <span id="BuisLeidingGevaarlijkeInhoudValue">0.6</span>(m)
            </div>
            <div class="form-row">
                <label for="GasHogeDruk">Afstand tot Gas Hoge Druk:</label>
                <input id="GasHogeDruk" type="range" min="0" max="10" value="0.6" step="0.1" 
                    oninput="document.getElementById('GasHogeDrukValue').textContent = this.value">
                <span id="GasHogeDrukValue">0.6</span>(m)
            </div>
             <div class="form-row">
                <label for="GasLageDruk">Afstand tot Gas Lage Druk:</label>
                <input id="GasLageDruk" type="range" min="0" max="10" value="0.6" step="0.1" 
                    oninput="document.getElementById('GasLageDrukValue').textContent = this.value">
                <span id="GasLageDrukValue">0.6</span>(m)
            </div>
            <div class="form-row">
                <label for="Hoogspanning">Afstand tot Hoogspanning:</label>
                <input id="Hoogspanning" type="range" min="0" max="10" value="0.6" step="0.1" 
                    oninput="document.getElementById('HoogspanningValue').textContent = this.value">
                <span id="HoogspanningValue">0.6</span>(m)
            </div>
        </div>
    `,
        showCancelButton: true,
        cancelButtonText: 'Annuleren',
        confirmButtonText: 'Opslaan',
        preConfirm: () => {
            const projectName = document.getElementById('projectName').value.trim();
            const projectNumber = document.getElementById('projectNumber').value.trim();
            if (!projectName || !projectNumber) {
                Swal.showValidationMessage('Projectnaamen Projectnummer zijn verplicht!');
                return null;
            }

            return {
                projectName: projectName.replace(/[^a-zA-Z0-9_-]/g, "_"),
                projectNumber: projectNumber.replace(/[^a-zA-Z0-9_-]/g, "_"),
                klicFile: document.getElementById('klicFile').value,
                geulbreedte: document.getElementById('geulbreedte').value,
                geslotenVerharding: document.getElementById('geslotenVerharding').value,
                openVerharding: document.getElementById('openVerharding').value,
                halfVerhard: document.getElementById('halfVerhard').value,
                onverhard: document.getElementById('onverhard').value,
                groenvoorzieningLaag: document.getElementById('groenvoorzieningLaag').value,
                groenvoorzieningHoog: document.getElementById('groenvoorzieningHoog').value,
                groenvoorzieningBos: document.getElementById('groenvoorzieningBos').value,
                nogo: document.getElementById('nogo').value,
                klicDrukte: document.getElementById('klicDrukte').value,
                waterkering: document.getElementById('waterkering').value,
                natura2000: document.getElementById('natura2000').value,
                BuisLeidingGevaarlijkeInhoud: document.getElementById('BuisLeidingGevaarlijkeInhoud').value,
                GasHogeDruk: document.getElementById('GasHogeDruk').value,
                GasLageDruk: document.getElementById('GasLageDruk').value,
                Hoogspanning: document.getElementById('Hoogspanning').value,
            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // generate json and tigger download
            const data = result.value;

            // Create GeoJSON data
            var geoJSONData = {
                projectName : data.projectName + '_' + data.projectNumber,
                geulbreedte: data.geulbreedte,
                projectgebiedWKT: projectgebiedWKT,
                startEindPuntWKT: startEindPuntWKT,
                nogoZonesWKT: nogoZonesWKT,
                hulplijnenWKT: hulplijnenWKT,
                boorlijnenWKT: boorlijnenWKT,
                klicFile: data.klicFile,
                geslotenVerharding: data.geslotenVerharding,
                openVerharding: data.openVerharding,
                halfVerhard: data.halfVerhard,
                onverhard: data.onverhard,
                groenvoorzieningLaag: data.groenvoorzieningLaag,
                groenvoorzieningHoog: data.groenvoorzieningHoog,
                groenvoorzieningBos: data.groenvoorzieningBos,
                nogo: data.nogo,
                klicDrukte: data.klicDrukte,
                waterkering: data.waterkering,
                natura2000: data.natura2000,
                BuisLeidingGevaarlijkeInhoud: data.BuisLeidingGevaarlijkeInhoud,
                GasHogeDruk: data.GasHogeDruk,
                GasLageDruk: data.GasLageDruk,
                Hoogspanning: data.Hoogspanning,                
            };

            // Create a Blob with the GeoJSON data
            var blob = new Blob([JSON.stringify(geoJSONData, null, 2)], {
                type: "application/json",
            });

            // Download the file
            saveAs(blob, data.projectName + '_' + data.projectNumber + ".json");

            // Show success message and ask if the user wants to send the JSON by email
            Swal.fire({
                icon: 'success',
                title: 'Bestand gedownload!',
                text: 'Het GeoJSON-bestand is succesvol gedownload.',
                showCancelButton: true,
                cancelButtonText: 'Annuleren',
                confirmButtonText: 'Verstuur via e-mail',
            }).then((result) => {
                if (result.isConfirmed) {
                    // Open a modal to send the email
                    emailBody = generateEmailBody(data);
                    sendEmailWithAttachment(data.projectName, blob, emailBody);
                }
            });
        }
    });
}

function generateEmailBody(data) {
    return `
        Beste Medewerker van SUE,
            
            Bij deze doe ik een aanvraag voor een automatisch tracé voor het project ${data.projectName}.
            
            Projectinformatie:
            - Projectnaam: ${data.projectName}
            - Projectnummer: ${data.projectNumber}
            - KLIC-bestand: ${data.klicFile}
            - Geulbreedte: ${data.geulbreedte} meter
            - Gesloten verharding: ${data.geslotenVerharding}%
            - Open verharding: ${data.openVerharding}%
            - Half verhard: ${data.halfVerhard}%
            - Onverhard: ${data.onverhard}%
            - Groenvoorziening (gras/lage beplanting): ${data.groenvoorzieningLaag}%
            - Groenvoorziening (heesters/struiken/bomen): ${data.groenvoorzieningHoog}%
            - Groenvoorziening (bebossing): ${data.groenvoorzieningBos}%
            - NoGo: ${data.nogo}%
            - KLIC (kabeldrukte): ${data.klicDrukte}%
            - BuisLeiding Gevaarlijke Inhoud: ${data.BuisLeidingGevaarlijkeInhoud} meter
            - Gas Hoge Druk: ${data.GasHogeDruk} meter
            - Gas Lage Druk: ${data.GasLageDruk} meter
            - Hoogspanning: ${data.Hoogspanning} meter
            
            Attentie: Voeg alstublieft het gedownloade JSON-bestand als bijlage bij deze e-mail. Anders kunnen wij uw aanvraag niet verwerken.

            
        `.replace(/\n/g, "%0A");
}

// Function to open an email modal
function sendEmailWithAttachment(projectName, fileBlob, emailBody) {
    // Pre-fill email address
    const user = "smartengineering-klm"; // Replace with the actual username part of the email
    const domain = "vangelder"; // Replace with the actual domain part of the email
    const tld = "com";
    const email = `${user}@${domain}.${tld}`;

    // Convert blob to data URL
    const fileReader = new FileReader();
    fileReader.onload = function () {
        const mailtoLink = `mailto:${email}?subject=Automatisch%20Tracé%20Aanvraag%20SUE%20voor%20project:${projectName}&body=${emailBody}`;

        // Open the email client with the prefilled information
        window.location.href = mailtoLink;
    };
    fileReader.readAsDataURL(fileBlob);
}

// Event listener to trigger downloadGeoJSON function
document.getElementById("downloadButton").addEventListener("click", downloadGeoJSON);

// Handling popup close button (optional for visual purposes)
document.getElementById("closePopup").addEventListener("click", function () {
    document.getElementById("popup").style.display = "none";
});

// add current location locator button
L.control.locate().addTo(map);