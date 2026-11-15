import "../react19-compat";
import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vite-plus/test";
import { cleanup, configure } from "@testing-library/react";

// The first screen is lazy-loaded, and its styles compile on that first import.
configure({ asyncUtilTimeout: 5000 });

import store, { STORE_EVENT } from "../store/store";
import { VIEWS } from "../utils/enums";

Object.defineProperty(navigator, "geolocation", {
  configurable: true,
  value: {
    getCurrentPosition: vi.fn(),
    watchPosition: vi.fn(() => 1),
    clearWatch: vi.fn(),
  },
});

if (typeof navigator.vibrate !== "function") {
  navigator.vibrate = () => true;
}

afterEach(() => {
  cleanup();
  window.location.hash = "#/";
  store.emit(STORE_EVENT.UPDATE_STATE, {
    "ancillaries.warning_modal_open": true,
    "ancillaries.start_modal_open": false,
    "ancillaries.pause_modal_open": false,
    "ancillaries.confirm_end_walk_modal_open": false,
    "ancillaries.side_menu_open": false,
    "play_state.is_unlocked": true,
    "play_state.unlock_value": 0,
    "play_state.has_location": false,
    "play_state.paused": false,
    "play_state.view": VIEWS.LANDING,
  });
});
