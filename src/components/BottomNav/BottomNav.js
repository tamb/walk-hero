import React, { Component } from "react";
import { FaWalking } from "react-icons/fa";
import { Button } from "reactstrap";

import {fire} from "./../../utils";
import {CUSTOMEVENTS} from "./../../enums";

import "./BottomNav.scss";

export default class BottomNav extends Component {

  openData = () =>{
    fire(CUSTOMEVENTS.DATA_MODAL_TOGGLE)
  }

  render() {
    return (
      <div className="BottomNav">
        <h1 className="BottomNav__title">Walk Hero</h1>
        <Button className="BottomNav__icon" onClick={this.openData}>
          <FaWalking />
        </Button>
      </div>
    );
  }
}
