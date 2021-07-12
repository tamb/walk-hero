import React from "react";
import PropTypes from "prop-types";
import { Modal, ModalFooter, ModalBody, Alert } from "reactstrap";

import VibrateButton from "./../../components/VibrateButton/VibrateButton";

const RaidGameStatusModal = (props) => {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <Modal centered backdrop="static" isOpen={isOpen}>
      <ModalBody className="text-center">
        <Alert color={props.won ? "success" : "danger"}>
          {props.won && <p>Huzzah! You've saved the town!</p>}

          {!props.won && <p>Oh no! The town has been sacked!</p>}
        </Alert>
      </ModalBody>
      <ModalFooter className="d-flex justify-content-between">
        <VibrateButton
          color={props.won ? "success" : "danger"}
          onClick={() => setIsOpen(false)}
        >
          {props.won ? "Excellent!" : "Darn!"}
        </VibrateButton>
      </ModalFooter>
    </Modal>
  );
};

RaidGameStatusModal.propTypes = {
  won: PropTypes.bool,
};

export default RaidGameStatusModal;
