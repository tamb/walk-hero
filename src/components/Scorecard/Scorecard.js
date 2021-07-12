import React from "react";
import PropTypes from "prop-types";
import { fromS } from "hh-mm-ss";

import { toMiles } from "./../../workers/measurements";

import "./Scorecard.scss";

function Scorecard(props) {
  return (
    <div className="Scorecard" tabIndex="0">
      <div>⏱️ {fromS(props.quest.journey_time_s, "hh:mm:ss")}</div>
      <div>🗺️ {toMiles(props.quest.distance_traveled_cm).toFixed(2)}mi</div>
    </div>
  );
}

Scorecard.propTypes = {
  journeyTime: PropTypes.number,
  traveled: PropTypes.number,
};

Scorecard.defaultProps = {
  journeyTime: 0,
  traveled: 0,
};

export default Scorecard;
