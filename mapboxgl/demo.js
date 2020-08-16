import chicagoTransit from "./chicagoTransit.js";
{
  mapboxgl.accessToken =
    "pk.eyJ1IjoibWVsaXNzYW4iLCJhIjoiczJYeVJGZyJ9.K4Ie0hc1OFYepQaXACwnTg";
  var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/light-v10",
    center: [-87.665, 41.87],
    zoom: 12,
  });

  const placeholderGeoJson = {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [],
          },
        },
      ],
    },
  };

  map.on("load", function () {
    // get road-related layerids in a hacky gross way
    const roadLayerIds = map.style.stylesheet.layers
      .map((layer) => layer.id.includes("road") && layer.id)
      .filter((id) => id && !id.includes("label"));
    roadLayerIds.forEach((id) => {
      map.setPaintProperty(id, "line-color", "#6a3d9a");
    });

    map.addSource("busses", placeholderGeoJson);
    map.addLayer({
      id: "busses",
      type: "circle",
      source: "busses",
      paint: {
        "circle-color": "#fdbf6f",
        "circle-stroke-color": "#ff7f00",
        "circle-stroke-width": 1,
        "circle-radius": 6,
        "circle-opacity": 0.9,
      },
    });
  });
  map.on("styledata", function () {
    const routes = "3,4,6,8,9,11,12,20";
    if (map.getSource("busses")) {
      chicagoTransit.getBusLocations(routes).then((busLocations) => {
        map.getSource("busses").setData(busLocations);
      });

      const busUpdates = setInterval(() => {
        chicagoTransit.getBusLocations(routes).then((busLocations) => {
          map.getSource("busses").setData(busLocations);
        });
      }, 5000);
      setTimeout(() => {
        clearInterval(busUpdates);
      }, 25000);
    }
  });
}
