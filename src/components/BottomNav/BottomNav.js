import React from "react";
import PropTypes from "prop-types";
import { Button } from "reactstrap";

import { fire } from "./../../utils";
import { CUSTOMEVENTS } from "./../../enums";

import "./BottomNav.scss";

function BottomNav(props) {
  function openData() {
    fire(CUSTOMEVENTS.DATA_MODAL_TOGGLE);
  }

  return (
    <div className="BottomNav">
      <h1 className="BottomNav__title">Walk Hero</h1>
      <Button
        disabled={!props.hasLocation}
        className="BottomNav__icon"
        onClick={openData}
      >
        <span className="sr-only">Settings</span>
        ⚙️
      </Button>
    </div>
  );
}

BottomNav.propTypes = {
  hasLocation: PropTypes.bool,
};

export default BottomNav;
