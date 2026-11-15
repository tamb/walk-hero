export function position(latitude: number, longitude: number): GeolocationPosition {
  return {
    timestamp: 1_700_000_000_000,
    coords: {
      latitude,
      longitude,
      altitude: null,
      accuracy: 5,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
    },
  } as GeolocationPosition;
}
