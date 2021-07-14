import React from "react";
import PropTypes from "prop-types";
import { version } from "../../../package.json";

import store, { STORE_EVENT } from "../../store/store";

import VibrateButton from "../VibrateButton/VibrateButton";

import "./BottomNav.scss";

function pause() {
  store.emit(STORE_EVENT.UPDATE_STATE, {
    "ancillaries.pause_modal_open": true,
  });
}

function requestWakeLock() {
  store.emit(STORE_EVENT.REQUEST_WAKELOCK);
}

function openSettings() {
  store.emit(STORE_EVENT.UPDATE_STATE, {
    "ancillaries.side_menu_open": true,
  });
}
function BottomNav(props) {
  return (
    <div className="BottomNav">
      <div>
        <h1 className="BottomNav__title">Walk Hero</h1>
        <p className="BottomNav__version">
          <small>version {version}</small>
        </p>
      </div>
      <VibrateButton
        disabled={!props.hasLocation}
        className="BottomNav__icon"
        onClick={pause}
      >
        <span className="sr-only">
          {props.paused ? "Continue" : "Pause Game"}
        </span>
        {props.paused ? "\u{1F6B6}" : "\u{23F8}"}
      </VibrateButton>
      <VibrateButton className="BottomNav__icon" onClick={requestWakeLock}>
        🔒<span className="sr-only">Lock Screen</span>
      </VibrateButton>
      <VibrateButton
        disabled={!props.hasLocation}
        className="BottomNav__icon"
        onClick={openSettings}
      >
        <span className="sr-only">Settings</span>
        ⚙️
      </VibrateButton>
    </div>
  );
}

BottomNav.propTypes = {
  hasLocation: PropTypes.bool,
  paused: PropTypes.bool,
};

export default BottomNav;
