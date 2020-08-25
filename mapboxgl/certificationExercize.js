import chicagoTransit from "./chicagoTransit.js";

const _routefilter = { current: [3, 4, 6, 8, 9, 11, 12, 20] };

const _ctaBusLocations = {};

const _toggleRouteFilterValue = (stringValue) => {
  const value = Number(stringValue);

  if (_routefilter.current.includes(value)) {
    _routefilter.current = _routefilter.current.filter(
      (item) => item !== value
    );
  } else {
    _routefilter.current.push(value);
  }
};

const _updateMapData = (map) => {
  const filteredCtaBusLocations = {
    type: "FeatureCollection",
    features: _ctaBusLocations.current.features.filter((feature) =>
      _routefilter.current.includes(Number(feature.properties.routeId))
    ),
  };

  if (map.getSource("busses")) {
    map.getSource("busses").setData(filteredCtaBusLocations);
  } else {
    _initializeBusData(map).then(() => {
      map.getSource("busses").setData(filteredCtaBusLocations);
    });
  }
};

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
    const content = `
    <dl>
      <dt>Vehicle ID (from external source):</dt>
        <dd>${feature.properties.vid}</dd>
      <dt>Route Number (from external source):</dt>
        <dd>${feature.properties.routeId}</dd>
      <dt>Property of 'point'(?)</dt>
        <dd>Latitude: ${event.lngLat.lat}</dd>
        <dd>Longitude: ${event.lngLat.lng}</dd>
    <dl>`;

    popup.setLngLat(coordinates).setHTML(content).addTo(map);
  });
  map.on("mouseleave", "busses", function () {
    popup.remove();
  });
};

const customizeBasemapStyle = (map) => {
  map.on("load", () => {
    // get road-related layerids in a hacky gross way
    const roadLayerIds = map.style.stylesheet.layers
      .map((layer) => layer.id.includes("road") && layer.id)
      .filter((id) => id && !id.includes("label"));
    roadLayerIds.forEach((id) => {
      map.setPaintProperty(id, "line-color", "#6a3d9a");
    });
  });
};

const _initializeBusData = (map) => {
  const placeholderSource = {
    type: "geojson",
    generateId: true,
    data: {
      type: "FeatureCollection",
      features: [],
    },
  };

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
  return new Promise((resolve) => {
    map.once("styledata", () => {
      resolve();
    });
  });
};
const addUpdatingData = (map, routes) => {
  const setUpDataFetching = () => {
    if (map.getSource("busses")) {
      console.log("grab data");
      chicagoTransit.getBusLocations(routes).then((busLocations) => {
        _ctaBusLocations.current = busLocations;

        _updateMapData(map);
        // this feed only updated once per minute, so you wont see much movement on the map, but it technically works
        const busUpdates = setInterval(() => {
          chicagoTransit.getBusLocations(routes).then((busLocations) => {
            _ctaBusLocations.current = busLocations;
            _updateMapData(map);
          });
        }, 60000);
        setTimeout(() => {
          clearInterval(busUpdates);
        }, 60000 * 3);
        map.off("styledata", setUpDataFetching);
      });
    }
  };
  _routefilter.current = routes;

  map.on("load", function () {
    _initializeBusData(map).then(() => {
      setUpDataFetching();
    });
  });
};

const addDataFilter = (map) => {
  const routeFilterElement = document.getElementById("route-filter");
  _routefilter.current.forEach((route) => {
    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = route;
    input.checked = true;
    input.value = route;
    input.onclick = (event) => {
      _toggleRouteFilterValue(event.target.value);
      _updateMapData(map);
    };
    routeFilterElement.appendChild(input);

    var label = document.createElement("label");
    label.setAttribute("for", route);
    label.textContent = route;
    routeFilterElement.appendChild(label);
  });
};

const addCenterMapOnClick = (map) => {
  map.on("click", function (event) {
    map.panTo(event.lngLat);
  });
};

const addNewPointOnClick = (map) => {
  const catMarkerElement = document.createElement("div");
  catMarkerElement.className = "cat-marker";

  map.on("click", function (event) {
    new mapboxgl.Marker(catMarkerElement).setLngLat(event.lngLat).addTo(map);
  });
};

const changeBasemapOnZoom = (map) => {
  map.on("zoom", () => {
    const currentZoom = map.getZoom();
    const baseMap =
      currentZoom > 12
        ? "mapbox://styles/mapbox/satellite-v9"
        : "mapbox://styles/mapbox/light-v10";
    map.setStyle(baseMap);

    // woah my data dissappeared!
    // Very imperfect hack to get it back.
    // Fell down an overly imperative rabbit hole and
    // gave up trying to prevent unecessary layer updates.
    // gave up making my work-around code cruft-free.
    // would be nice if setStyle() returned something indicating if it had updated or not
    map.on("styledata", () => {
      _updateMapData(map);
    });
  });
};

export {
  addCenterMapOnClick,
  addDataFilter,
  addNewPointOnClick,
  addPopupOnHover,
  addStylingOnHover,
  addUpdatingData,
  changeBasemapOnZoom,
  customizeBasemapStyle,
};
