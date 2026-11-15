import React from "react";
import PropTypes from "prop-types";
import { Modal, ModalHeader, ModalFooter, ModalBody } from "reactstrap";

import VibrateButton from "../../components/VibrateButton/VibrateButton";

const PauseModal = (props) => {
  return (
    <Modal centered backdrop="static" isOpen={props.isOpen}>
      <ModalHeader>Pause Menu</ModalHeader>
      <ModalBody className="text-center">Your game is paused.</ModalBody>
      <ModalFooter className="d-flex justify-content-between">
        <VibrateButton color="danger" onClick={props.endWalk}>
          End Game 🔚
        </VibrateButton>
        <VibrateButton color="success" onClick={props.continueWalk}>
          Continue 🚶
        </VibrateButton>
      </ModalFooter>
    </Modal>
  );
};

PauseModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  endWalk: PropTypes.func.isRequired,
  continueWalk: PropTypes.func.isRequired,
};

export default PauseModal;
