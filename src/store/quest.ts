interface IQuest {
  active: boolean;
  date_created: string | null;
  distance_p2p_from_origin_cm: number;
  distance_traveled_cm: number;
  total_distance_traveled_cm: number;
  journey_time_s: number;
  location_pings: number;
  farthest_geodata_from_origin: GeolocationPosition | null;
  geodata: GeolocationPosition | null;
  origin_geodata: GeolocationPosition | null;
  origin_city: object | null;
  cities_visited: object[];
  current_city: object | null; // TODO: define city type
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
