import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Button } from "reactstrap";

import knight from "./../../gif/knightherov3.gif";
import { version } from "./../../../package.json";

import "./Landing.scss";

const Landing = (props) => {
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
        <Col>
          <Button block color="success" onClick={props.goQuest}>
            QUEST
          </Button>
        </Col>

        <Col>
          <Button
            block
            disabled={true}
            color="primary"
            onClick={props.goMinigames}
          >
            MINIGAMES
          </Button>
        </Col>
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

Landing.propTypes = {
  goQuest: PropTypes.func.isRequired,
  goMinigames: PropTypes.func.isRequired,
};

export default Landing;
