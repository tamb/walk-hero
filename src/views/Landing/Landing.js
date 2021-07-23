import React from "react";
import {
  Row,
  Col,
  Alert,
  Form,
  Input,
  Label,
  FormGroup,
  Button,
} from "reactstrap";
import { useHistory } from "react-router-dom";

import store, { STORE_EVENT } from "../../store/store";
import { VIEWS } from "../../utils/enums";
import VibrateButton from "../../components/VibrateButton/VibrateButton";
import knight from "./../../gif/knightherov3.gif";
import { version } from "../../../package.json";

import "./Landing.scss";

const noMiniGames = false;
const allowDesktop = true;

const Landing = (props) => {
  const browserHistory = useHistory();
  const [loggedIn, setLoggedIn] = React.useState(false); // TODO: add actual check
  var isMobile =
    "ontouchstart" in document.documentElement &&
    /mobi/i.test(navigator.userAgent);

  function goQuest() {
    store.emit(STORE_EVENT.UPDATE_STATE, { "play_state.view": VIEWS.QUEST });
    browserHistory.push("/quest");
  }

  function goMinigames() {
    store.emit(STORE_EVENT.UPDATE_STATE, {
      "play_state.view": VIEWS.MINIGAMES,
    });
    browserHistory.push("/minigames");
  }

  function handleOTPRequestSubmit(event) {
    event.preventDefault();

    const options = {
      method: "POST",
      body: JSON.stringify({ email: "t.saporito@gmail.com" }),
      headers: {
        "Content-Type": "application/json",
      },
    };
    fetch("http://localhost:8888/login", options)
      .then((res) => res.json())
      .then((res) => console.log(res));
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
        {isMobile ||
          (allowDesktop && !loggedIn && (
            <Form onSubmit={handleOTPRequestSubmit}>
              <FormGroup>
                <Label>Email</Label>
                <Input type="email" />
              </FormGroup>
              <Button>Get OTP</Button>
            </Form>
          ))}
        {(isMobile || allowDesktop) && loggedIn && (
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
