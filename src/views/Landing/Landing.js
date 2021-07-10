import React from "react";
import { Row, Col, Alert } from "reactstrap";
import { useHistory } from "react-router-dom";

import store, { STORE_EVENT } from "@store/store";
import { VIEWS } from "@utils/enums";
import VibrateButton from "@components/VibrateButton/VibrateButton";
import knight from "@gif/knightherov3.gif";
import { version } from "@root/package.json";

import "./Landing.scss";

const noMiniGames = false;
const allowDesktop = true;

const Landing = (props) => {
  const browserHistory = useHistory();
  var isMobile =
    "ontouchstart" in document.documentElement &&
    /mobi/i.test(navigator.userAgent);

  function goQuest() {
    store.emit(STORE_EVENT.UPDATE_STATE, { "play_state.view": VIEWS.QUEST });
    browserHistory.push("/quest");
  }

  function goMinigames() {
    store.emit(STORE_EVENT.UPDATE_STATE, { "play_state.view": VIEWS.MINIGAMES });
    browserHistory.push("/minigames");
  }
  return (
    <div className="Landing">
      <Row>
        <Col className="text-center">
          <h1>WALK HERO</h1>
          <hr />
        </Col>
      </Row>
      <Row>
        <Col className="text-center">
          <small className="Landing__version">v{version}</small>
        </Col>
      </Row>
      <Row>
        {(isMobile || allowDesktop) && (
          <React.Fragment>
            <Col>
              <VibrateButton block color="success" onClick={goQuest}>
                QUEST
              </VibrateButton>
            </Col>

            <Col>
              <VibrateButton
                block
                disabled={noMiniGames}
                color="primary"
                onClick={goMinigames}
              >
                MINIGAMES
              </VibrateButton>
            </Col>
          </React.Fragment>
        )}
        {!isMobile && !allowDesktop && (
          <Col>
            <Alert color="warning">
              <p>
                Walk Hero does <strong>not</strong> currently support desktop
                gameplay.
              </p>
              <p>
                Please play on a mobile device using the latest Chromium-based
                browser (Chrome, Brave, Edge)
              </p>
            </Alert>
          </Col>
        )}
      </Row>
      <Row>
        <Col className="text-center mt-1 author">
          <small>by Tamb</small>
        </Col>
      </Row>
      <Row>
        <Col className="text-center mt-1">
          <div>
            <img alt="knight hero" src={knight} />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Landing;
