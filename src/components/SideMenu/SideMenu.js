import React from "react";
import PropTypes from "prop-types";
import {
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  UncontrolledCollapse,
} from "reactstrap";

import store, { EVENTS } from "@store/store";
import VibrateButton from "@components/VibrateButton/VibrateButton";

import "./SideMenu.scss";

class SideMenu extends React.Component {
  constructor(props) {
    super(props);
  }

  closeMenu = () => {
    store.emit(EVENTS.UPDATE_STATE, { "ancillaries.side_menu_open": false });
  };

  render() {
    return (
      <React.Fragment>
        <div className={`SideMenu ${this.props.open ? "SideMenu--open" : ""}`}>
          <VibrateButton onClick={this.closeMenu}>❌</VibrateButton>
          <Row>
            <Col>
              <VibrateButton onClick={this.props.lockScreen}>
                🔒&nbsp;Lock Screen
              </VibrateButton>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <h2 id="settings-toggler">Settings </h2>
            </Col>
            <UncontrolledCollapse toggler="#settings-toggler">
              <Col xs={12}>
                <FormGroup>
                  <Label check>
                    <Input
                      defaultChecked={this.props.vibrationsOn}
                      onChange={(e) => {
                        return e.target.checked;
                      }}
                      type="checkbox"
                    />
                    📳&nbsp;Game Vibration
                  </Label>
                </FormGroup>
              </Col>
              <Col xs={12}>
                <FormGroup>
                  <Label check>
                    <Input
                      defaultChecked={this.props.hapticOn}
                      onChange={(e) => {
                        return e.target.checked;
                      }}
                      type="checkbox"
                    />
                    👆&nbsp;Haptic Feedback
                  </Label>
                </FormGroup>
              </Col>

              <Col xs={12}>
                <FormGroup>
                  <Label check>
                    <Input
                      defaultChecked={this.props.hapticOn}
                      onChange={(e) => {
                        return e.target.checked;
                      }}
                      type="checkbox"
                    />
                    🔊&nbsp;Sound FX
                  </Label>
                </FormGroup>
              </Col>

              <Col xs={12}>
                <FormGroup>
                  <Label check>
                    <Input
                      defaultChecked={this.props.hapticOn}
                      onChange={(e) => {
                        return e.target.checked;
                      }}
                      type="checkbox"
                    />
                    🎵&nbsp;Music
                  </Label>
                </FormGroup>
              </Col>
            </UncontrolledCollapse>
          </Row>
          <Row>
            <Col xs={12}>
              <h2 id="how-to-toggler">How to Play</h2>
            </Col>
           <UncontrolledCollapse toggler="#how-to-toggler">
           <Col xs={12}>
              <ol>
                <li>Safely walk around</li>
                <li>Interact with the people and things you find on screen.</li>
                <li>
                  Conquer challenges and earn experience to become The Ultimate
                  Hero!
                </li>
              </ol>
            </Col>
           </UncontrolledCollapse>
          </Row>

          <Row>
            <Col xs={12}>
              <h2 id="about-toggler">About</h2>
            </Col>
            <UncontrolledCollapse toggler="#about-toggler">
            <Col xs={12}>
              <ul>
                <li>
                  Walk Hero brings retro fun to walking! Get outside and become
                  The Ultimate Hero.
                </li>
                <li>
                  Walk Hero is a mobile-only game. Walk Hero uses the latest in
                  internet technology and works best with Chromium-based
                  browsers like Chrome, Brave, & Edge.
                </li>
              </ul>
            </Col>
            </UncontrolledCollapse>
          </Row>
        </div>
        <div className="SideMenu__backdrop" onClick={this.closeMenu}></div>
      </React.Fragment>
    );
  }
}

SideMenu.propTypes = {
  open: PropTypes.bool,
  vibrationsOn: PropTypes.bool,
  hapticOn: PropTypes.bool,
};

SideMenu.defaultProps = {
  open: false,
  vibrationsOn: false,
  hapticOn: false,
};

export default SideMenu;
