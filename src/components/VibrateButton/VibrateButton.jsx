import React from "react";
import PropTypes from "prop-types";
import { Button } from "reactstrap";
import { connect } from "../../store/connect";

import store from "../../store/store";

function VibrateButton(props) {
  const pattern = props.pattern === undefined ? [10] : props.pattern;

  function clickVibrate() {
    if (props.vibrationsOn) {
      window.navigator.vibrate(pattern);
    }
    props.onClick();
  }

  const newProps = { ...props };
  delete newProps.onClick;
  delete newProps.vibrationsOn;
  delete newProps.pattern;

  return (
    <Button onClick={clickVibrate} {...newProps}>
      {props.children}
    </Button>
  );
}

VibrateButton.propTypes = {
  pattern: PropTypes.arrayOf(PropTypes.number),
  onClick: PropTypes.func,
};

export default connect(store, {
  vibrationsOn: "game_settings.vibrations",
})(VibrateButton);
