import utilities from "./utilities.js";
const getBusLocations = (routeIds) => {
  // for focus, a participant of a course focusing on front-end tech shouldnt have to set up a proxy server
  // to avoid CORS issues with an external data source.Better for Mapbox to supply one with an unrestrictive CORS policy

  const busLocationsUrl = `../.netlify/functions/getbusdata?rt=${routeIds}`;
  return fetch(busLocationsUrl)
    .then((blob) => blob.json())
    .then((data) => {
      return new Promise((resolve) => {
        resolve(utilities.convertToGeojson(data));
      });
    });
};
export default { getBusLocations };
