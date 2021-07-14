import React from "react";
import PropTypes from "prop-types";
import { Modal, ModalHeader, ModalFooter, ModalBody } from "reactstrap";

import VibrateButton from "../../components/VibrateButton/VibrateButton";

const SliderPrecisionDirectionsModal = (props) => {
  return (
    <Modal centered backdrop="static" isOpen={props.isOpen}>
      <ModalHeader>Catch a Crook!</ModalHeader>
      <ModalBody className="text-center">
        <p>A villain is on the loose...</p>
        <hr />
        <p className="d-flex">
          <span className="fs-2">😈</span>
          <span>
            "You'll never catch me! I'll kill everyone you've ever loved!"
          </span>
        </p>
        <hr />
        <p>
          Catch the Crook
          <div className="d-flex justify-content-center">
            <div className="SliderPrecision__goal-icon"></div>
          </div>
          in the Cage
        </p>
      </ModalBody>
      <ModalFooter className="d-flex justify-content-between">
        <VibrateButton color="success" onClick={props.handleOk}>
          Ok!
        </VibrateButton>
      </ModalFooter>
    </Modal>
  );
};

SliderPrecisionDirectionsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleOk: PropTypes.func.isRequired,
};

export default SliderPrecisionDirectionsModal;
