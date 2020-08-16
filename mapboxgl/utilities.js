const convertToGeojson = (objectArrayWithLatLon) => {
  //note unlike initial placeholder json, this must not have type and data parent properties
  const features = objectArrayWithLatLon["bustime-response"].vehicle.map(
    (feature) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [feature.lon, feature.lat] },
    })
  );
  return {
    type: "FeatureCollection",
    features: features,
  };
};
export default { convertToGeojson };
