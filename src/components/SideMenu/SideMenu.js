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

import store, { STORE_EVENT } from "../../store/store";
import VibrateButton from "../VibrateButton/VibrateButton";

import "./SideMenu.scss";

class SideMenu extends React.Component {
  closeMenu = () => {
    store.emit(STORE_EVENT.UPDATE_STATE, { "ancillaries.side_menu_open": false });
  };

  render() {
    return (
      <React.Fragment>
        <div className={`SideMenu ${this.props.open ? "SideMenu--open" : ""}`}>
          <Row className="border-bottom mb-4">
            <Col xs={10}>
              <h2>Walk Hero</h2>
            </Col>
            <Col xs={2}>
              <VibrateButton className="float-right" onClick={this.closeMenu}>
                ❌
              </VibrateButton>
            </Col>
          </Row>

          <Row className="border">
            <Col xs={12}>
              <h3 id="settings-toggler">Settings &gt;</h3>
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
          <Row className="border border-top-0">
            <Col xs={12}>
              <h3 id="how-to-toggler">How to Play &gt;</h3>
            </Col>
            <UncontrolledCollapse toggler="#how-to-toggler">
              <Col xs={12}>
                <ol>
                  <li>
                    Start your <strong>Quest</strong>.
                  </li>
                  <li>Safely walk around</li>
                  <li>
                    Interact with <strong>Quest Strangers</strong> and&nbsp;
                    <strong>Quest Items</strong> you find on screen.
                  </li>
                  <li>
                    But be careful. Some Strangers and Items could lead you to
                    a&nbsp;
                    <strong>Quest Contest</strong> where you must face off
                    with&nbsp; your opponent in any number of&nbsp;
                    <strong>Diversions</strong>.
                  </li>
                  <li>
                    If you triumph, you will be showered in&nbsp;
                    <strong>Rewards</strong>!
                  </li>
                  <li>
                    If you want to put your phone away, hit the{" "}
                    <strong>Screen Lock</strong> 🔒 button and Walk Hero will
                    remain open while conserving battery.
                  </li>
                  <li>
                    Conquer your domain and become{" "}
                    <strong>The Ultimate Walk Hero!</strong>
                  </li>
                </ol>
              </Col>
            </UncontrolledCollapse>
          </Row>

          <Row className="border border-top-0">
            <Col xs={12}>
              <h3 id="about-toggler">About &gt;</h3>
            </Col>
            <UncontrolledCollapse toggler="#about-toggler">
              <Col xs={12}>
                <ul>
                  <li>
                    Walk Hero brings retro fun to walking! Get outside and
                    become The Ultimate Walk Hero.
                  </li>
                  <li>
                    The Quest gameplay of Walk Hero is mobile-only. Walk Hero
                    uses the latest in Internet technology and works best with
                    Chromium-based browsers like{" "}
                    <a
                      href="https://www.google.com/chrome/index.html"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Chrome
                    </a>
                    ,&nbsp;
                    <a
                      href="https://brave.com/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Brave&nbsp;
                    </a>
                    , &&nbsp;
                    <a
                      href="https://www.microsoft.com/en-us/edge"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Edge
                    </a>
                    .
                  </li>
                </ul>
              </Col>
            </UncontrolledCollapse>
          </Row>
          <Row className="border border-top-0">
            <Col xs={12}>
              <h3 id="feedback-toggler">Support &gt;</h3>
            </Col>
            <Col xs={12}>
              <UncontrolledCollapse toggler="#feedback-toggler">
                <iframe
                  src="https://docs.google.com/forms/d/e/1FAIpQLScrMJigK0nkkP3lhL1noojcyG-Yj2ighAzJLKUe5Jv6tuS7Ww/viewform?embedded=true"
                  width="320"
                  height="715"
                  frameBorder="0"
                  marginHeight="0"
                  marginWidth="0"
                  title="feedback"
                >
                  Loading…
                </iframe>
              </UncontrolledCollapse>
            </Col>
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
