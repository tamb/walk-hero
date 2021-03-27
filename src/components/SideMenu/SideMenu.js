import React from "react";
import PropTypes from "prop-types";
import { Row, Col } from "reactstrap";
import { connect } from "substate-connect";

import store, { EVENTS } from "@store/store";

import "./SideMenu.scss";

class SideMenu extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className="SideMenu">menu!</div>;
  }
}

SideMenu.propTypes = {};

SideMenu.defaultProps = {};

export default SideMenu;
