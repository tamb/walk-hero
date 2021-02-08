import React from "react";
import PropTypes from "prop-types";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

const StartModal = (props) => {
  return (
    <Modal isOpen={props.isOpen} centered>
      <ModalHeader>Start Your Game</ModalHeader>
      <ModalBody className="d-flex justify-content-center align-items-center pt-5 pb-5">
        Would you like to start a new walk or continue an existing one?
      </ModalBody>
      <ModalFooter className="d-flex justify-content-between">
        <Button disabled color="secondary" onClick={props.continueOldWalk}>
          Existing Walk
        </Button>
        <Button color="success" onClick={props.startNewWalk}>
          Start a NEW Walk!
        </Button>
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
