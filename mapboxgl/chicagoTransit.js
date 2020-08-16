import utilities from "./utilities.js";
const getBusLocations = (routeIds) => {
  const proxyUrl = "http://cors-anywhere.herokuapp.com/";
  const busLocationsUrl = `http://ctabustracker.com/bustime/api/v2/getvehicles?key=8rWBbYr4wbNziLJYRDvaJKK7n&format=json&rt=${routeIds}`;
  return fetch(proxyUrl + busLocationsUrl)
    .then((blob) => blob.json())
    .then((data) => {
      return new Promise((resolve) => {
        resolve(utilities.convertToGeojson(data));
      });
    });
};
export default { getBusLocations };
