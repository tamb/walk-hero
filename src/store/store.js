import substate from "substate";
import cuid from "cuid";

import { VIEWS } from "@utils/enums";

const hero = {
  // should be saves
  id: cuid(), // pk
  name: null,
};

// this data is important and should be saved
const quest = {
  parent_id: hero.id, // fk
  id: cuid(), // pk
  active: false,
  cities_visited: [],
  current_city: null,
  date_created: null,
  distance_p2p_from_origin_cm: 0,
  distance_traveled_cm: 0,
  farthest_geodata_from_origin: null,
  geodata: null,
  journey_time_s: 0,
  location_pings: 0,
  origin_geodata: null,
  total_distance_traveled_cm,
};

// this should not need to be saved anywhere
const play_state = {
  hasLocation: false,
  isUnlocked: true,
  paused: false,
  unlockValue: 0,
  view: VIEWS.LANDING,
  WakeLockSentinel: null,
};

const game_settings = {
  // save this
  vibrations: true,
  soundFX: true,
  music: true,
};

// this should not need to be saved anywhere
const modals = {
  // todo: NPCModal, BattleModal, GiftModal, NotificationModal -- possible new modal types
  confirmEndWalkModalOpen: false, // quest
  settingsModalOpen: false, // quest & minigames
  instructionsModalOpen: false, // 2
  nameModalOpen: false, // 3
  pauseModalOpen: false, // quest & minigames
  startModalOpen: false, // 4
  warningModalOpen: true, // 1
};

const store = new substate({
  name: "WalkHero",
  state: {
    game_settings,
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

export default store;
