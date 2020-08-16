import chicagoTransit from "./chicagoTransit.js";
{
  mapboxgl.accessToken =
    "pk.eyJ1IjoibWVsaXNzYW4iLCJhIjoiczJYeVJGZyJ9.K4Ie0hc1OFYepQaXACwnTg";
  var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/light-v10",
    center: [-87.62, 41.87],
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
        console.log("done");
        clearInterval(busUpdates);
      }, 25000);
    }
  });
}
