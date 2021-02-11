import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col, Button } from "reactstrap";

import "./Landing.scss";

const Landing = (props) => {
  return (
    <div className="Landing">
        <Row>
          <Col className="text-center">
            <h1>WALK HERO</h1>
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
            <Col className="text-center mt-1">
                <small>by Tamb</small>
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
