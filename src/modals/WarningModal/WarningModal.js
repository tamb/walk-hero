import React from "react";
import PropTypes from "prop-types";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Container,
  Row,
  Col,
} from "reactstrap";

import VibrateButton from "@components/VibrateButton/VibrateButton";

function WarningModal(props) {
  return (
    <Modal isOpen={props.isOpen} centered backdrop="static" keyboard={false}>
      <ModalHeader>WARNING:</ModalHeader>
      <ModalBody>
        <Container fluid>
          <Row>
            <Col>
              Note:
              <ul>
                <li>
                  Please pay attention 👀 to your surroundings 🚘 at all times.
                </li>
                <li>
                  We do not 🚫🕵️ share your location information 📍 with anyone
                  else 👍.
                </li>
                <li>Have fun and be safe! 👌.</li>
              </ul>
            </Col>
          </Row>
        </Container>
      </ModalBody>
      <ModalFooter className="d-flex justify-content-between">
        <VibrateButton color="warning" onClick={props.denyWarning}>
          I DO NOT Accept
        </VibrateButton>
        <VibrateButton color="success" onClick={props.acceptWarning}>
          I accept
        </VibrateButton>
      </ModalFooter>
    </Modal>
  );
}

WarningModal.propTypes = {
  acceptWarning: PropTypes.func,
  denyWarning: PropTypes.func,
  isOpen: PropTypes.bool,
};

export default WarningModal;
