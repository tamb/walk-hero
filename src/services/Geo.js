export const toTime = (geoData) => {
  return new Date(geoData.timestamp).toUTCString();
};

export const toLatLong = (geoData) => {
  return [geoData.coords.latitude, geoData.coords.longitude];
};


