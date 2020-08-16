const convertToGeojson = (data) => {
  const features = data["bustime-response"].vehicle.map((feature) => ({
    type: "Feature",
    geometry: { type: "Point", coordinates: [feature.lon, feature.lat] },
  }));
  return {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: features,
    },
  };
};
export default { convertToGeojson };
