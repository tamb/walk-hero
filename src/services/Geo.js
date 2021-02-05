export const toTime = (geoData) => {
  const o = new Intl.DateTimeFormat(navigator.languages, {
    timeStyle: "medium",
    dateStyle: "short",
  });
  return o.format(new Date(geoData.timestamp));
};

export const toLatLong = (geoData) => {
  return [geoData.coords.latitude, geoData.coords.longitude];
};

export function getStartingPoint(startingPointCB) {
  navigator.geolocation.getCurrentPosition(startingPointCB);
}

export function startPoll(successCB) {
  return navigator.geolocation.watchPosition(successCB, null, {
    enableHighAccuracy: true,
    timeout: 1000,
  });
}

export function killPoll(poll) {
  navigator.geolocation.clearWatch(poll);
}

export function cloneGeoData(geoData) {
  return {
    timestamp: geoData.timestamp,
    coords: {
      latitude: geoData.coords.latitude,
      longitude: geoData.coords.longitude,
      altitude: geoData.coords.altitude,
      accuracy: geoData.coords.accuracy,
      altitudeAccuracy: geoData.coords.altitudeAccuracy,
      heading: geoData.coords.heading,
      speed: geoData.coords.speed,
    },
  };
}
