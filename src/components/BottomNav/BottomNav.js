import React from "react";
import PropTypes from "prop-types";
import { version } from "@root/package.json";

import store, { EVENTS } from "@store/store";

import VibrateButton from "@components/VibrateButton/VibrateButton";

import "./BottomNav.scss";

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
        onClick={props.togglePaused}
      >
        <span className="sr-only">
          {props.paused ? "Continue" : "Pause Game"}
        </span>
        {props.paused ? "\u{1F6B6}" : "\u{23F8}"}
      </VibrateButton>
      <VibrateButton className="BottomNav__icon" onClick={props.lockScreen}>
        🔒<span className="sr-only">Lock Screen</span>
      </VibrateButton>
      <VibrateButton
        disabled={!props.hasLocation}
        className="BottomNav__icon"
        onClick={() =>
          store.emit(EVENTS.UPDATE_STATE, {
            "ancillaries.side_menu_open": true,
          })
        }
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
  togglePaused: PropTypes.func,
};

export default BottomNav;
