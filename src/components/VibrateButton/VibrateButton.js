import React from "react";
import PropTypes from "prop-types";
import { Button } from "reactstrap";
import { connect } from "substate-connect";

import store from "@store/store";

function VibrateButton(props) {
  function clickVibrate() {
    if (props.vibrationsOn) {
      window.navigator.vibrate(props.pattern);
    }
    props.onClick();
  }

  const newProps = { ...props };
  delete newProps.onClick;

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

VibrateButton.defaultProps = {
  pattern: [10],
};

export default connect(store, {
  vibrationsOn: "gameState.vibrationsOn",
})(VibrateButton);
