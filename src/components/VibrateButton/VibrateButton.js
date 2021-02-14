import React from "react";
import PropTypes from "prop-types";
import { Button } from "reactstrap";

function VibrateButton(props) {
  function clickVibrate() {
    window.navigator.vibrate(props.pattern);
    props.onClick();
  }

  const newProps = { ...props };
  delete newProps.onClick;

  return (
    <Button onClick={clickVibrate} {...props}>
      {props.children}
    </Button>
  );
}

VibrateButton.propTypes = {
  pattern: PropTypes.arrayOf(PropTypes.number),
  onClick: PropTypes.func,
};

VibrateButton.defaultProps = {
  pattern: [50],
};

export default VibrateButton;
