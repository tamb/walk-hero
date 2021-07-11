import React from "react";
import PropTypes from "prop-types";
import { Modal, ModalHeader, ModalFooter, ModalBody } from "reactstrap";

import VibrateButton from "@components/VibrateButton/VibrateButton";

const ConfirmEndWalkModal = (props) => {
  return (
    <Modal centered backdrop="static" isOpen={props.isOpen}>
      <ModalHeader>End Walk</ModalHeader>
      <ModalBody>Do you want to end your walk?</ModalBody>
      <ModalFooter className="d-flex justify-content-between">
        <VibrateButton color="warning" onClick={props.cancelEndWalk}>
          Nope. Keep Walking.
        </VibrateButton>
        <VibrateButton color="success" onClick={props.confirmEndWalk}>
          Yes, End Walk.
        </VibrateButton>
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
