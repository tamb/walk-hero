import React from "react";
import {
  Row,
  Col,
  Alert,
  Form,
  Input,
  Label,
  FormGroup,
  FormFeedback,
  Button,
  Tooltip,
  Collapse,
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
  const [otpReqRes, setOTPReqResp] = React.useState(false);
  const [otpReqResStatus, setOTPReqRespStatus] = React.useState(false);
  const [otpTooltipOpen, setOTPTooltipOpen] = React.useState(false);
  const [requestingOTP, setRequestingOTP] = React.useState(false);

  var isMobile =
    "ontouchstart" in document.documentElement &&
    /mobi/i.test(navigator.userAgent);

  function toggleTooltip() {
    setOTPTooltipOpen(!otpTooltipOpen);
  }
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
    setRequestingOTP(true);

    const options = {
      method: "POST",
      body: JSON.stringify({ email: "t.saporito@gmail.com" }),
      headers: {
        "Content-Type": "application/json",
      },
    };
    fetch("http://localhost:8888/login", options)
      .then((res) => {
        setOTPReqRespStatus(res.status);
        setRequestingOTP(false);
        return res.json();
      })
      .then((res) => {
        setOTPReqResp("Please check your email.");
      })
      .catch((err) => {
        setOTPReqResp(
          "There was an error on our end.  Please try again.  If this error persists please contact XXXXX"
        );
        setRequestingOTP(false);
        setLoggedIn(false);
      });
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
        {(isMobile || allowDesktop) && !loggedIn && (
          <Col>
            <Collapse
              isOpen={
                (!loggedIn && !requestingOTP) ||
                (otpReqResStatus === 200 && !requestingOTP)
              }
            >
              <Form onSubmit={handleOTPRequestSubmit}>
                <Col xs={12}>
                  <FormGroup className={otpReqRes ? "was-validated" : ""}>
                    <Label for="email" className="sr-only">
                      Email
                    </Label>
                    <Input
                      id="email"
                      placeholder="Your email"
                      name="email"
                      required
                      bsSize="lg"
                      type="email"
                      readOnly={otpReqResStatus === 200}
                    />
                    <FormFeedback>{otpReqRes}</FormFeedback>
                  </FormGroup>
                </Col>
                <Col xs={12}>
                  <Button type="submit" block={true}>
                    Send my One-Time Password
                  </Button>
                  <Button id="otpTooltip" color="link" type="button">
                    <small>What is a One-Time Password ?</small>
                  </Button>
                  <Tooltip
                    placement="bottom"
                    isOpen={otpTooltipOpen}
                    target="otpTooltip"
                    toggle={toggleTooltip}
                    fade={false}
                  >
                    A <strong>One-Time Password</strong> (OPT) is a single-use
                    password that is sent to your email. You then use it to log
                    into Walk Hero.
                  </Tooltip>
                </Col>
              </Form>
            </Collapse>
          </Col>
        )}
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
