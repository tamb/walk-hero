import substate from "substate";
import cuid from "cuid";

import { VIEWS } from "@utils/enums";

// Save the following in IDB
const hero = {
  id: cuid(), // pk
  name: null,
};

const game_settings = {
  vibrations: true,
  sound_fx: true,
  music: true,
};

const quest = {
  parent_id: hero.id, // fk
  id: cuid(), // pk
  active: false,
  cities_visited: [],
  current_city: null,
  date_created: null,
  distance_p2p_from_origin_cm: 0,
  distance_traveled_cm: 0, //todo- do I need this?
  farthest_geodata_from_origin: null,
  geodata: null,
  journey_time_s: 0,
  location_pings: 0,
  origin_geodata: null,
  total_distance_traveled_cm: 0,
};

// Does NOT need to be saved in IDB
const play_state = {
  has_location: false,
  is_unlocked: true,
  paused: false,
  unlock_value: 0,
  view: VIEWS.LANDING,
  wake_lock_sentinel: null,
};

const modals = {
  // todo: NPCModal, BattleModal, GiftModal, NotificationModal -- possible new modal types
  confirm_end_walk_modal_open: false, // quest
  settings_modal_open: false, // quest & minigames
  instructions_modal_open: false, // 2
  name_modal_open: false, // 3
  pause_modal_open: false, // quest & minigames
  start_modal_open: false, // 4
  warning_modal_open: true, // 1
};

const store = new substate({
  name: "WalkHero",
  state: {
    game_settings, // save to IDB
    hero, // save to IDB
    modals,
    play_state,
    quest, // save to IDB
  },
});

// const store = new substate({
//   name: "WalkHero",
//   state: {
//     // gameState: {
//     //   hasLocation: false,
//     //   isUnlocked: true,
//     //   paused: false,
//     //   start: false,
//     //   unlockValue: 0,
//     //   walkEnded: false,
//     //   vibrationsOn: true,
//     //   view: VIEWS.LANDING,
//     //   WakeLockSentinel: null,
//     // },
//     ...modals,
//     // modals: {
//     //   confirmEndWalkModalOpen: false,
//     //   settingsModalOpen: false,
//     //   instructionsModalOpen: false,
//     //   pauseModalOpen: false,
//     //   startModalOpen: false,
//     //   warningModalOpen: true,
//     // },

//     // geo is now quest_data:
//     ...quest,
//     // geo: {
//     //   // geo state
//     //   // TODO: snag walk from indexeddb or create new walk and expose in spread operator
//     //   distanceFromStartCM: 0,
//     //   distanceTraveledInCM: 0,
//     //   farthestGeoDataFromStart: null,
//     //   geoData: {
//     //     coords: {},
//     //   },
//     //   journeyTime: 0,
//     //   startingLocation: {},
//     //   totalDistanceTraveledInCM: 0,
//     //   citiesVisited: [],
//     //   currentCity: null,
//     //   locationPings: 0,
//     // },
//   },
// });

export const EVENTS = {
  PAUSED: "PAUSED",
  UNPAUSED: "UNPAUSED",
  STATE_UPDATED: "STATE_UPDATED",
  UPDATE_STATE: "UPDATE_STATE",
  WRITE_STATE_UPDATED: "WRITE_STATE_UPDATED",
  START_WALK: "START_WALK",
  END_WALK: "END_WALK",
};

export default store;
