import React from "react";
import PropTypes from "prop-types";
import { version } from "@root/package.json";

import { fire } from "@utils/utils";
import { CUSTOMEVENTS } from "@utils/enums";

import VibrateButton from "@components/VibrateButton/VibrateButton";

import "./BottomNav.scss";

function BottomNav(props) {
  function openData() {
    fire(CUSTOMEVENTS.DATA_MODAL_TOGGLE);
  }

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
      <VibrateButton
        disabled={!props.hasLocation}
        className="BottomNav__icon"
        onClick={openData}
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
