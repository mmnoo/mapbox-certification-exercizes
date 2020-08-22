import utilities from "./utilities.js";
const getBusLocations = (routeIds) => {
  // would be nice to have a live updating data endpoint supplied for the course
  // so I dont need to get distracted with CORS hacks that stop working and restrict # of calls
  // or figuring out third party data sources. Now I am dealing with sunk costs.
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
