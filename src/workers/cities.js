import cities from "./../data/cities.json";
import {toLatLong} from "./../services/Geo";

export function getEntryByLatLong(geoData) {
  // 5 decimal
  const latLong = toLatLong(geoData)
  return cities.filter((city) => {
    //   return [typeof city.lat, city.lng];
    // }
    // const diffLat = parseFloat(city.lat) - Number(latLong[0].toFixed(5));
    const diffLat = Math.abs(parseFloat(city.lat) - latLong[0]);
    const diffLng = Math.abs(parseFloat(city.lng) - latLong[1]);

    const match = diffLat < 0.01 && diffLng < 0.01;

    return match === true;

    // return diffLat < 0.1 && diffLng < 0.1;
  });
}
