import cities from "./../../data/cities.json";
import { toLatLong } from "./../../services/Geo";

export function getCityByGeoData(geoData) {
  // 5 decimal
  const latLong = toLatLong(geoData);
  return cities.filter((city) => {
    const diffLat = Math.abs(parseFloat(city.lat) - latLong[0]);
    const diffLng = Math.abs(parseFloat(city.lng) - latLong[1]);
    const match = diffLat < 0.01 && diffLng < 0.01;

    return match === true;
  });
}
