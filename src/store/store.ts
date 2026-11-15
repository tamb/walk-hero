import substate from "substate";
import { VIEWS } from "../utils/enums";

// Save the following in IDB
import { hero } from "./hero";
import { game_settings } from "./gameSettings";
import { quest } from "./quest";
import { minigames } from "./minigames";

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

export const STORE_EVENT = {
  PAUSED: "PAUSED",
  UNPAUSED: "UNPAUSED",
  STATE_UPDATED: "STATE_UPDATED",
  UPDATE_STATE: "UPDATE_STATE",
  WRITE_STATE_UPDATED: "WRITE_STATE_UPDATED",
  START_WALK: "START_WALK",
  END_WALK: "END_WALK",
  REQUEST_WAKELOCK: "REQUEST_WAKELOCK",
  REPLAY_MINI: "REPLAY_MINI",
  LOCKSCREEN_SLIDE: "LOCKSCREEN_SLIDE",
};

export default store;
