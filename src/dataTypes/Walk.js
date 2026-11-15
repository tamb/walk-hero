import Entity from "./Entity";
import { cloneGeoData } from "../services/Geo";

export default class Walk extends Entity {
  constructor(walkName) {
    super();
    this.name = walkName;
    this.pauses = 0;
    this.seconds_played = 0;
    this.total_distance_traveled_cm = 0;
    this.distance_from_start_cm = 0;
    this.starting_geo_data = null;
    this.farthest_geo_data_from_start = null;
    this.geo_data = null; // this is readonly and needs to be converted for use with workers.
    this.cities = []; // push city and country values into here
  }

  setGeoData(GeolocationPositionObject) {
    this.geo_data = cloneGeoData(GeolocationPositionObject);
  }

  setStartingGeoData(GeolocationPositionObject) {
    this.starting_geo_data = cloneGeoData(GeolocationPositionObject);
  }

  setFarthestGeoData(GeolocationPositionObject) {
    this.farthest_geo_data_from_start = cloneGeoData(GeolocationPositionObject);
  }
}
