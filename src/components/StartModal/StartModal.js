import React from "react";
import PropTypes from "prop-types";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import VibrateButton from "./../VibrateButton/VibrateButton";

const StartModal = (props) => {
  return (
    <Modal isOpen={props.isOpen} centered>
      <ModalHeader>Start Your Game</ModalHeader>
      <ModalBody className="d-flex justify-content-center align-items-center pt-5 pb-5">
        Would you like to start a new walk or continue an existing one?
      </ModalBody>
      <ModalFooter className="d-flex justify-content-between">
        <VibrateButton disabled color="secondary" onClick={props.continueOldWalk}>
          Existing Walk
        </VibrateButton>
        <VibrateButton color="success" onClick={props.startNewWalk}>
          Start a NEW Walk!
        </VibrateButton>
      </ModalFooter>
    </Modal>
  );
};

StartModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  startNewWalk: PropTypes.func.isRequired,
  continueOldWalk: PropTypes.func,
};

export default StartModal;
