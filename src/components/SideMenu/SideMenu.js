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
    return (
      <React.Fragment>
        <div className="SideMenu SideMenu--open">menu!</div>
        <div className="SideMenu__backdrop"></div>
      </React.Fragment>
    );
  }
}

SideMenu.propTypes = {};

SideMenu.defaultProps = {};

export default SideMenu;
