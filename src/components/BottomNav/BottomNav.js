import React, { Component } from "react";
import PropTypes from "prop-types";
import { FaWalking } from "react-icons/fa";
import { Button } from "reactstrap";

import "./BottomNav.scss";

export default class BottomNav extends Component {
  static propTypes = {
    prop: PropTypes,
  };

  render() {
    return (
      <div className="BottomNav">
        <h1 className="BottomNav__title">Walk Hero</h1>
        <Button className="BottomNav__icon">
          <FaWalking />
        </Button>
      </div>
    );
  }
}
