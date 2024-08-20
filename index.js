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

    if (!projectgebiedWKT || startEindPuntWKT.length === 0) {
        alert(
            "Het tekenen van een projectgebied en op zijn minst één start en één eindpunt is verplicht."
        );
        return;
    }

    var projectName = prompt("Voer een projectnaam in:");
    projectName = projectName.replace(/[^a-zA-Z0-9]/g, "_");
    if (!projectName || projectName.trim() === "") {
        alert("Projectnaam is verplicht.");
        return;
    }

    var geoJSONData = {
        projectgebiedWKT: projectgebiedWKT,
        startEindPuntWKT: startEindPuntWKT,
        nogoZonesWKT: nogoZonesWKT,
        hulplijnenWKT: hulplijnenWKT,
        boorlijnenWKT: boorlijnenWKT,
    };

    var blob = new Blob([JSON.stringify(geoJSONData, null, 2)], {
        type: "application/json",
    });
    saveAs(blob, projectName + ".json");

    document.getElementById("popup").style.display = "block";
}

document
    .getElementById("downloadButton")
    .addEventListener("click", downloadGeoJSON);

document.getElementById("closePopup").addEventListener("click", function () {
    document.getElementById("popup").style.display = "none";
});

// add current location locator button
L.control.locate().addTo(map);

// invisible email
(function () {
    const user = "smartengineering-klm"; // Replace with the actual username part of the email
    const domain = "vangelder"; // Replace with the actual domain part of the email
    var tld = "com";
    const email = user + "@" + domain + "." + tld;
    const emailLink = document.getElementById("email-link");

    // Set the email address as the text content of the span
    emailLink.textContent = email;

    // Make the email a clickable mailto link
    emailLink.innerHTML = `<a href="mailto:${email}">${email}</a>`;
})();

// JavaScript to handle the close button
document.getElementById("closePopup").addEventListener("click", function () {
    document.getElementById("popup").style.display = "none";
});

// add map scale
L.control.scale().addTo(map);

// add map coorrdinate display
map.on("contextmenu", function (e) {
    const { lat, lng } = e.latlng;
    const rdCoords = toRDNew(lat, lng);
    const popupContent = `
        <div>
            <strong>RD Coordinates</strong><br>
            X: ${rdCoords[0]}<br>
            y: ${rdCoords[1]}
        </div>
    `;
    L.popup().setLatLng(e.latlng).setContent(popupContent).openOn(map);
});

// add instruction button
// Instructions to show
var instructions =
    "De kaart kan als volgt gebruikt worden:\n\nJe kunt de kaart navigeren door te klikken en te slepen, en je kunt in- en uitzoomen met de '+' en '-' knoppen in de linkerbovenhoek of door met de muis te scrollen.\n\nOok kan je een adres zoeken met de 'zoek' knop in de rechterbovenhoek.\n\nOm een projectgebied, start- en eindpunten, no-go zones, hulplijnen en boorlijnen te tekenen, klik op de respectievelijke knoppen in de linkerbovenhoek van de kaart en teken vervolgens op de kaart \n\n Om de getekende vormen te downloaden als een JSON-bestand, klik op de 'Download JSON' knop in de rechterbovenhoek van de kaart.\n\nDe kaart bevat ook een schaal in de linkerbenedenhoek voor referentie. \n\n Als je ergens op de kaart met de rechtermuisknop klikt, verschijnt er een popup die de RD (Rijksdriehoekscoördinaten) coördinaten van de aangeklikte locatie weergeeft. \n\nJe kunt ook de huidige locatie van de gebruiker vinden door op de knop 'Locate' in de rechterbovenhoek van de kaart te klikken.";
// Function to show instructions
function showInstructions() {
    alert(instructions);
}

// Show instructions when the page loads
window.onload = showInstructions;

// Show instructions when the button is clicked
document.getElementById("instructionButton").onclick = showInstructions;
