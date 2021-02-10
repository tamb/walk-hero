import React from "react";
import PropTypes from "prop-types";
import { Modal, ModalHeader, ModalFooter, ModalBody, Button } from "reactstrap";

const ConfirmEndWalkModal = (props) => {
  return (
    <Modal centered backdrop="static" isOpen={props.isOpen}>
      <ModalHeader>End Walk</ModalHeader>
      <ModalBody>Do you want to end your walk?</ModalBody>
      <ModalFooter>
        <Button color="warning" onClick={props.cancelEndWalk}>
          Nope. Keep Walking.
        </Button>
        <Button color="success" onClick={props.confirmEndWalk}>
          Yes, End Walk.
        </Button>
      </ModalFooter>
    </Modal>
  );
};

ConfirmEndWalkModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    cancelEndWalk: PropTypes.func.isRequired,
    confirmEndWalk: PropTypes.func.isRequired,
};

export default ConfirmEndWalkModal;
