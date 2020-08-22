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
  exercizes.addUpdatingData(map);
  exercizes.addStylingOnHover(map);
}
