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

  const placeholderSource = {
    type: "geojson",
    generateId: true,
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

    map.addSource("busses", placeholderSource);
    map.addLayer({
      id: "busses",
      type: "circle",
      source: "busses",
      paint: {
        "circle-color": "#fdbf6f",
        "circle-stroke-color": "#ff7f00",
        "circle-stroke-width": 1,
        "circle-radius": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          12,
          6,
        ],
        "circle-opacity": 0.9,
      },
    });
  });
  map.on("styledata", function () {
    const routes = "3,4,6,8,9,11,12,20";
    if (map.getSource("busses")) {
      chicagoTransit.getBusLocations(routes).then((busLocations) => {
        map.getSource("busses").setData(busLocations);
        // this feed only updated once per minute, so you wont see much movement on the map, but it technically works
        // const busUpdates = setInterval(() => {
        //   chicagoTransit.getBusLocations(routes).then((busLocations) => {
        //     map.getSource("busses").setData(busLocations);
        //   });
        // }, 60000);
        // setTimeout(() => {
        //   clearInterval(busUpdates);
        // }, 60000 * 10);
      });
    }
  });
  {
    let hoveredStateId; //should be unecessary
    map.on("mousemove", "busses", (event) => {
      // cant find API documentation detailing features object on MapMouseEvent
      if (event.features.length > 0) {
        map.setFeatureState(
          { source: "busses", id: event.features[0].id },
          { hover: true }
        );
      }
      hoveredStateId = event.features[0].id; // should be unecessary
    });
    map.on("mouseleave", "busses", function () {
      // For DX this event should include a features property like the mousemove event does.
      // For function, but also consistency.Then a developer doesnt have to create a symbol to hold 'hoverStateId'.
      map.setFeatureState(
        { source: "busses", id: hoveredStateId },
        { hover: false }
      );
    });
  }
}
