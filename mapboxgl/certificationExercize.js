import chicagoTransit from "./chicagoTransit.js";

const addStylingOnHover = (map) => {
  //const hoveredStateID; // tracking this should be unecessary
  map.on("mousemove", "busses", (event) => {
    const feature = event.features[0];
    // cant find API documentation detailing features object on MapMouseEvent
    if (feature) {
      //hoveredStateID = feature.id; // should be unecessary
      map.setFeatureState(
        {
          source: "busses",
          id: feature.id,
        },
        { hover: true }
      );
    }
  });
  map.on("mouseleave", "busses", function () {
    // For DX the mouseleave event should include a features property like the mousemove event does.
    // For function, but also consistency.Then a developer doesnt have to create a symbol to hold 'hoverStateId'.

    // map.setFeatureState(
    //   {
    //     source: "busses",
    //     id: hoveredStateID,
    //   },
    //   { hover: false }
    // );

    // hack to make sure all hover styling gets removed
    // obviously this is not good if the app is using feature state for other things
    // I wonder if having a features property on the mouseleave event
    // might also fix the bug where some hover styling remains despite this mouseleave listener,
    // I wonder if the example at https://docs.mapbox.com/mapbox-gl-js/example/hover-styles/
    // is creating a race condition, which leaves multiple points with hover styling erroneously

    map.removeFeatureState({
      source: "busses",
    });
  });
};

const addPopupOnHover = (map, popup) => {
  map.on("mousemove", "busses", (event) => {
    const feature = event.features[0];
    const coordinates = feature.geometry.coordinates.slice();
    const content = `<dl><dt>Vehicle ID :</dt><dd>${feature.properties.vid} (technically this info is both from external source, and point properties)</dd><dl>`;

    popup.setLngLat(coordinates).setHTML(content).addTo(map);
  });
  map.on("mouseleave", "busses", function () {
    popup.remove();
  });
};
const addUpdatingData = (map) => {
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
};
export {
  addPopupOnHover,
  addStylingOnHover,
  addUpdatingData,
};
