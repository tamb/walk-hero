import React from "react";
import PropTypes from "prop-types";
import { FaWalking } from "react-icons/fa";
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
        <FaWalking />
      </Button>
    </div>
  );
};

BottomNav.propTypes = {
  hasLocation: PropTypes.bool,
};

export default BottomNav;
