import React from "react";
import PropTypes from "prop-types";
import { Modal, ModalHeader, ModalFooter, ModalBody } from "reactstrap";

import VibrateButton from "../../components/VibrateButton/VibrateButton";

const ReorderDirectionsModal = (props) => {
  return (
    <Modal centered backdrop="static" isOpen={props.isOpen}>
      <ModalHeader>Reorder!</ModalHeader>
      <ModalBody className="text-center">
        <p>A Peasant is asking for help...</p>
        <hr />
        <p className="d-flex">
          <span className="Hangman__mage">🙋‍♂️</span>
          <span>
            "Help! I need to reorder my wheat from smallest bundle to biggest
            before the mean Lord arrives!"
          </span>
        </p>
        <hr />
        <p>🌾Reorder the crops!🌾</p>
      </ModalBody>
      <ModalFooter className="d-flex justify-content-between">
        <VibrateButton color="success" onClick={props.handleOk}>
          Ok!
        </VibrateButton>
      </ModalFooter>
    </Modal>
  );
};

ReorderDirectionsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleOk: PropTypes.func.isRequired,
};

export default ReorderDirectionsModal;
