export const toTime = (geoData: GeolocationPosition): string | undefined => {
  try {
    const o = new Intl.DateTimeFormat([...navigator.languages], {
      timeStyle: "medium",
      dateStyle: "short",
    });
    return o.format(new Date(geoData.timestamp));
  } catch (err) {
    console.error("[toTime] ", err);
  }
};

export const toLatLong = (
  geoData: GeolocationPosition
): number[] | undefined => {
  try {
    return [geoData.coords.latitude, geoData.coords.longitude];
  } catch (err) {
    console.error("[toLatLong] ", err);
  }
};

export function getStartingPoint(startingPointCB: PositionCallback) {
  navigator.geolocation.getCurrentPosition(startingPointCB);
}

export function startPoll(successCB: PositionCallback) {
  return navigator.geolocation.watchPosition(successCB, undefined, {
    enableHighAccuracy: true,
    timeout: 1000,
  });
}

export function killPoll(poll: number): void {
  navigator.geolocation.clearWatch(poll);
}

export function cloneGeoData(
  geoData: GeolocationPosition
): GeolocationPosition | undefined {
  try {
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
  } catch (err) {
    console.error("[cloneGeoData] ", err);
  }
}
