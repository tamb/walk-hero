import React from "react";
import PropTypes from "prop-types";
import { Modal, ModalHeader, ModalFooter, ModalBody, Button } from "reactstrap";

const PauseModal = (props) => {
  return (
    <Modal centered backdrop="static" isOpen={props.isOpen}>
      <ModalHeader>Pause Menu</ModalHeader>
      <ModalBody className="text-center">Your game is paused.</ModalBody>
      <ModalFooter className="d-flex justify-content-between">
        <Button color="danger" onClick={props.endWalk}>
          End Game 🔚
        </Button>
        <Button color="success" onClick={props.continueWalk}>
          Continue 🚶
        </Button>
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
