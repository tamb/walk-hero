import React from "react";
import PropTypes from "prop-types";
import { Modal, ModalFooter, ModalBody, ModalHeader, Button } from "reactstrap";
import Instructions from "./../Instructions/Instructions";

function InstructionModal(props) {
  return (
    <Modal isOpen={props.isOpen} backdrop="static" centered>
      <ModalHeader>Instructions</ModalHeader>
      <ModalBody>
        <Instructions />
      </ModalBody>
      <ModalFooter>
        <Button color="success" onClick={props.toggle}>
          Let's Go!
        </Button>
      </ModalFooter>
    </Modal>
  );
}

InstructionModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
};

export default InstructionModal;
