import React from "react";
import PropTypes from "prop-types";
import { connect } from "../../store/connect";
import { Link } from "react-router-dom";

import store from "../../store/store";

function VibrateLink(props: {
  onClick?: React.MouseEventHandler;
  vibrationsOn?: boolean;
  pattern?: number | number[];
  href: string;
  color?: string;
  children?: React.ReactNode;
}) {
  const pattern = props.pattern === undefined ? [10] : props.pattern;
  const color = props.color === undefined ? "link" : props.color;

  function clickVibrate(): void {
    if (props.vibrationsOn && pattern !== undefined) {
      window.navigator.vibrate(pattern);
    }
  }

  const {
    onClick: _onClick,
    vibrationsOn: _vibrationsOn,
    pattern: _pattern,
    href: _href,
    color: _color,
    children,
    ...rest
  } = props;

  return (
    <Link to={props.href} className={`btn btn-${color}`} onClick={clickVibrate} {...rest}>
      {children}
    </Link>
  );
}

VibrateLink.propTypes = {
  pattern: PropTypes.arrayOf(PropTypes.number),
  color: PropTypes.string,
  href: PropTypes.string,
};

export default connect(store, {
  vibrationsOn: "game_settings.vibrations",
})(VibrateLink);
