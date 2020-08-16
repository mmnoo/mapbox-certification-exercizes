import chicagoTransit from "./chicagoTransit.js";
{
  mapboxgl.accessToken =
    "pk.eyJ1IjoibWVsaXNzYW4iLCJhIjoiczJYeVJGZyJ9.K4Ie0hc1OFYepQaXACwnTg";
  var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11", //"mapbox://styles/mapbox/satellite-v9",
    center: [-87.62, 41.87],
    zoom: 12,
  });

  const placeholderGeoJson = {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [],
    },
  };
  const differentGeoJson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [-87.62, 41.87],
        },
      },
    ],
  };
  map.on("load", function () {
    map.addSource("busses", placeholderGeoJson);
    map.addLayer({
      id: "busses",
      type: "symbol",
      source: "busses",
      layout: {
        "icon-image": "monument-15",
      },
    });
  });
  map.on("styledata", function () {
    if (map.getSource("busses")) {
      map.getSource("busses").setData(differentGeoJson); // Error: Input data is not a valid GeoJSON object.
    }
  });
}
