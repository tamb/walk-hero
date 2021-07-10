import substate from "substate";
import { VIEWS } from "@utils/enums";

// Save the following in IDB
import { hero } from "./IHero";
import { game_settings } from "./IGameSettings";
import { quest } from "./IQuest";
import { minigames } from "./IMiniGames";

// Does NOT need to be saved in IDB
const play_state = {
  has_location: false,
  is_unlocked: true,
  paused: false,
  unlock_value: 0,
  view: VIEWS.LANDING, // TODO: do not worry about views, use router
  wake_lock_sentinel: null,
};

const ancillaries = {
  // todo: NPCModal, BattleModal, GiftModal, NotificationModal -- possible new modal types
  confirm_end_walk_modal_open: false, // quest
  settings_modal_open: false, // quest & minigames
  instructions_modal_open: false, // 2
  name_modal_open: false, // 3
  pause_modal_open: false, // quest & minigames
  start_modal_open: false, // 4
  warning_modal_open: true, // 1
  side_menu_open: false,
};

const store = new substate({
  name: "WalkHero",
  state: {
    game_settings, // save to IDB
    hero, // save to IDB
    quest, // save to IDB
    minigames, // save to IDB
    ancillaries,
    play_state,
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

export enum STORE_EVENT {
  PAUSED = "PAUSED",
  UNPAUSED = "UNPAUSED",
  STATE_UPDATED = "STATE_UPDATED",
  UPDATE_STATE = "UPDATE_STATE",
  WRITE_STATE_UPDATED = "WRITE_STATE_UPDATED",
  START_WALK = "START_WALK",
  END_WALK = "END_WALK",
  REQUEST_WAKELOCK = "REQUEST_WAKELOCK",
  REPLAY_MINI = "REPLAY_MINI",
}

export default store;
