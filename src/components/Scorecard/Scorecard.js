import React from "react";
import PropTypes from "prop-types";
import { fromS } from "hh-mm-ss";

import "./Scorecard.scss";

function Scorecard(props) {
  return (
    <div className="Scorecard" tabIndex="0">
      <div>⏱️ {fromS(props.journeyTime, "hh:mm:ss")}</div>
      <div>🗺️ {props.traveled}</div>
    </div>
  );
}

Scorecard.propTypes = {
  journeyTime: PropTypes.number,
  traveled: PropTypes.number,
};

export default Scorecard;
