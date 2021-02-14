import React from "react";
import PropTypes from "prop-types";
import { Modal, ModalFooter, ModalBody, ModalHeader } from "reactstrap";
import Instructions from "./../Instructions/Instructions";

import VibrateButton from "./../VibrateButton/VibrateButton";
function InstructionModal(props) {
  return (
    <Modal isOpen={props.isOpen} backdrop="static" centered>
      <ModalHeader>Instructions</ModalHeader>
      <ModalBody>
        <Instructions />
      </ModalBody>
      <ModalFooter>
        <VibrateButton color="success" onClick={props.toggle}>
          Got it! 👍
        </VibrateButton>
      </ModalFooter>
    </Modal>
  );
}

InstructionModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
};

export default InstructionModal;
