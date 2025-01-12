// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
    createMap(data.features);
});

function createMap(earthquakeData) {
    // Create the base map
    let myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5
    });

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

    // Create a GeoJSON layer
    let earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, latlng) {
            let depth = feature.geometry.coordinates[2];
            let magnitude = feature.properties.mag;
            let color = getColor(depth);
            let size = magnitude * 5; // Scale the size of the marker

            return L.circleMarker(latlng, {
                color: "#000",
                fillColor: color,
                weight: 1,
                opacity: 1,
                radius: size,
                fillOpacity: 0.75
            }).bindPopup(`Magnitude: ${magnitude}<br>Depth: ${depth} km<br>Location: ${feature.properties.place}`);
        }
    }).addTo(myMap);

// Set up a legend
    let legend = L.control({position: 'bottomright'});

    legend.onAdd = function () {
        let div = L.DomUtil.create('div', 'legend');
        div.innerHTML += '<h4>Depth (km)</h4>';
        div.innerHTML += '<i style="background: #ff0000"></i><span>-10-10</span><br>';
        div.innerHTML += '<i style="background: #ff7f00"></i><span>10-30</span><br>';
        div.innerHTML += '<i style="background: #ffff00"></i><span>30-50</span><br>';
        div.innerHTML += '<i style="background: #7fff00"></i><span>50-70</span><br>';
        div.innerHTML += '<i style="background: #00ff00"></i><span>70-90</span><br>';
        div.innerHTML += '<i style="background: #00ff00"></i><span>90+</span><br>';
        return div;
    };
    legend.addTo(myMap);
}

function getColor(depth) {
    return depth > 90 ? '#00ff00' : 
           depth > 70 ? '#7fff00' : 
           depth > 50 ? '#ffff00' : 
           depth > 30 ? '#ff7f00' : 
           depth > 10 ? '#ff0000' : 
                        '#ff0000';  
}