//initializing the map
var map = L.map('map').setView([8, -1.09], 6.5);


//Adding the scale bar to the map
L.control.scale({position:"bottomleft"}).addTo(map);

//Adding the openstreet map
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

var googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

var googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

var googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

//adding a marker
/*var marker = L.marker([8, -1.09]).addTo(map);
*/


//creating the styles
var regionStyle =  {
    color : "red",
    fillColor: "grey",
    fillOpacity : 0.1,
    weight : 1
}

var railwayStyle = {
    weight:4,
    color:"black"
}

var healthfacilitiesStyle ={
    radius:8,
    fillColor:"green",
    color:"red",
    weight:1
}

//Adding geojson layers

var regions_layer = L.geoJson(regions,{
    style:regionStyle,
    onEachFeature:function(feature, layer){

        area = turf.area(feature)/1000000
        center = turf.center(feature)
        center_long = center.geometry.coordinates[0]
        center_lat = center.geometry.coordinates[1]

        var label = `Name: ${feature.properties.region}<br>` + 
        `Region code: ${feature.properties.reg_code}<br>` +
        `Area: ${area.toFixed(2)} km² <br>`+
        /*`Area: ${feature.properties.area_sqkm} km²`*/
        `Center: Long ${center_long.toFixed(2)}, Lat ${center_lat.toFixed(2)}`
        
        layer.bindPopup(label)
    }
}).addTo(map)
var railways_layer = L.geoJson(railways, {
    style:railwayStyle,
    onEachFeature:function(feature, layer){
       layer.bindPopup(feature.properties.NAME)
    }
}).addTo(map)

var healthfacilities_layer = L.geoJson(healthfac,{
    pointToLayer: function(feature, latlng){
        return L.circleMarker(latlng, healthfacilitiesStyle)
    },
    onEachFeature:function(feature, layer){
        layer.bindPopup(feature.properties.name)
    }
    }).addTo(map)


///Adding WMS layers

var riversWMS = L.tileLayer.wms("http://localhost:8080/geoserver/geospatial/wms", {
    layers: 'geospatial:rivers',
    format: 'image/png',
    transparent: true,
    attribution: ""
}).addTo(map);


var healthFacilitiesWMS = L.tileLayer.wms("http://localhost:8080/geoserver/geospatial/wms", {
    layers: 'geospatial:Health_Facilities',
    format: 'image/png',
    transparent: true,
    attribution: ""
})


var poisWMS = L.tileLayer.wms("http://localhost:8080/geoserver/geospatial/wms", {
    layers: 'geospatial:PointOfInterest',
    format: 'image/png',
    transparent: true,
    attribution: ""
})


var railwaylineWMS = L.tileLayer.wms("http://localhost:8080/geoserver/geospatial/wms", {
    layers: 'geospatial:railwayline',
    format: 'image/png',
    transparent: true,
    attribution: ""
})

var regionsWMS = L.tileLayer.wms("http://localhost:8080/geoserver/geospatial/wms", {
    layers: 'geospatial:Regions',
    format: 'image/png',
    transparent: true,
    attribution: ""
})

var treecoverWMS = L.tileLayer.wms("http://localhost:8080/geoserver/geospatial/wms", {
    layers: 'geospatial:Savannah_tree_cover_v2',
    format: 'image/png',
    transparent: true,
    attribution: ""
});//.addTo(map);//THis is commented out since it is slow... But can be checked in the layer control to see the layer for a zoomed-in area.


//baselayers
var baseLayers = {
	"OpenStreetMap" : osm,
    "Google hybrid": googleHybrid,
    "Google Terrain": googleTerrain,
    "Google satellite": googleSat,
    "Google Terrain": googleTerrain
};

//adding layers

var GeoJson_group = L.LayerGroup[regions_layer,railways_layer,healthfacilities_layer]
var WMS_group = L.LayerGroup[riversWMS,treecoverWMS]
var overlays = {
/*    "Center of Ghana": marker,*/

//The following requires the leaflet-groupedlayercontrol plugin.
//If not using that plugin, make sure to remove the names GeoJson and WMS, and list all the layers together
"GeoJson": {
    "Regions of Ghana": regions_layer,
    "Railways": railways_layer,
    "Health facilities": healthfacilities_layer
},

"WMS": {
    "Points of interest": poisWMS,
    "Rivers": riversWMS,
    "Health facilities": healthFacilitiesWMS,
    "Railway lines": railwaylineWMS,
    "Regions": regionsWMS,
    "Tree cover": treecoverWMS
}

/*    "Regions of Ghana": regions_layer,
    "Railways": railways_layer,
    "Health facilities": healthfacilities_layer,

    "Rivers WMS": riversWMS,
    "Tree cover WMS": treecoverWMS
    */
};


//adding both baselayers and layers to the map //If not using the leaflet-groupedlayercontrol plugin, replace "groupedLayers" by "layers"
var layerControl = L.control.groupedLayers(baseLayers, overlays, {collapsed:true}).addTo(map);

//add print control to the map
L.control.browserPrint({position: 'topleft'}).addTo(map);

//Mouse move coordinates

map.on('mousemove', function(e){
    //console.log(e)
    $("#coordinates").html(`Lat:${e.latlng.lat.toFixed(3)}, Long:${e.latlng.lng.toFixed(3)}`)
})