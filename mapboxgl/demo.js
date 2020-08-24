import * as exercizes from "./certificationExercize.js";

{
  mapboxgl.accessToken =
    "pk.eyJ1IjoibWVsaXNzYW4iLCJhIjoiczJYeVJGZyJ9.K4Ie0hc1OFYepQaXACwnTg";
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/light-v10",
    center: [-87.665, 41.87],
    zoom: 12,
  });

  const routes = [3, 4, 6, 8, 9, 11, 12, 20];
  exercizes.addUpdatingData(map, routes);
  exercizes.addDataFilter(map);

  const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
  });
  exercizes.addPopupOnHover(map, popup);

  exercizes.addCenterMapOnClick(map);
  exercizes.addNewPointOnClick(map);
  exercizes.addStylingOnHover(map);
}
