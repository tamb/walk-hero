import React from "react";
import PropTypes from "prop-types";
import { connect } from "substate-connect";
import { Link } from "react-router-dom";

import store from "./../../store/store";

function VibrateLink(props) {
  function clickVibrate() {
    if (props.vibrationsOn) {
      window.navigator.vibrate(props.pattern);
    }
  }

  const newProps = { ...props };
  delete newProps.onClick;
  delete newProps.vibrationsOn;
  delete newProps.pattern;

  return (
    <Link
      to={props.href}
      className={`btn btn-${props.color}`}
      onClick={clickVibrate}
      {...newProps}
    >
      {props.children}
    </Link>
  );
}

VibrateLink.propTypes = {
  pattern: PropTypes.arrayOf(PropTypes.number),
  color: PropTypes.string,
  href: PropTypes.string,
};

VibrateLink.defaultProps = {
  pattern: [10],
  color: "link",
};

export default connect(store, {
  vibrationsOn: "game_settings.vibrations",
})(VibrateLink);
