interface IQuest {
  active: boolean;
  cities_visited: [];
  current_city?: string; // TODO: create IGeoCity
  date_created?: string;
  distance_p2p_from_origin_cm: number;
  distance_traveled_cm: number;
  farthest_geodata_from_origin?: GeolocationPosition;
  geodata?: GeolocationPosition;
  journey_time_s: number;
  location_pings: number;
  origin_geodata?: GeolocationPosition;
  origin_city?: object;
  total_distance_traveled_cm: number;
}

export const quest: IQuest = {
  active: false,
  cities_visited: [],
  current_city: null,
  date_created: null,
  distance_p2p_from_origin_cm: 0,
  distance_traveled_cm: 0,
  farthest_geodata_from_origin: null, // object
  geodata: null, // object
  journey_time_s: 0,
  location_pings: 0,
  origin_geodata: null, //object
  origin_city: null, // object
  total_distance_traveled_cm: 0,
};
