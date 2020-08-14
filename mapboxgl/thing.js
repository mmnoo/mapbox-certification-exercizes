{
  mapboxgl.accessToken =
    "pk.eyJ1IjoibWVsaXNzYW4iLCJhIjoiczJYeVJGZyJ9.K4Ie0hc1OFYepQaXACwnTg";
  var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11", //"mapbox://styles/mapbox/satellite-v9",  // stylesheet location
    center: [-74.5447, 40.6892], // starting position [lng, lat]
    zoom: 7, // starting zoom
  });

  const marker = new mapboxgl.Marker()
    .setLngLat([-74.5447, 40.6892])
    .addTo(map);
  const layerList = document.getElementById("menu");
  const inputs = layerList.getElementsByTagName("input");

  map.on("load", function () {
    map.addSource("wms-test-source", {
      type: "raster",
      tiles: [
        "https://img.nj.gov/imagerywms/Natural2015?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=Natural2015",
      ],
      tileSize: 256,
    });
    map.addLayer(
      {
        id: "wms-test-layer",
        type: "raster",
        source: "wms-test-source",
        paint: {},
      },
      "aeroway-line"
    );
  });

  //why isnt this in the map load function?
  function switchLayer(layer) {
    let layerId = layer.target.id;
    map.setStyle("mapbox://styles/mapbox/" + layerId);
  }

  for (let i = 0; i < inputs.length; i++) {
    inputs[i].onclick = switchLayer;
  }
}
