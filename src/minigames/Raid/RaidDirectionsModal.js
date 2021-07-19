import React from "react";
import PropTypes from "prop-types";
import { Modal, ModalHeader, ModalFooter, ModalBody, Alert } from "reactstrap";

import VibrateButton from "../../components/VibrateButton/VibrateButton";

const RaidDirectionsModal = (props) => {
  return (
    <Modal centered backdrop="static" isOpen={props.isOpen}>
      <ModalHeader>RAID!</ModalHeader>
      <ModalBody className="text-center">
        <Alert color="success">
          <p>
            <strong>Stop the enemies</strong> from attacking the village!
          </p>
          <p className="Raid__enemies">👹👿😠</p>
        </Alert>
        <Alert color="warning">
          <p>
            Do <strong>NOT</strong> hit the civilians!
          </p>
          <p className="Raid__enemies">👶😝😬</p>
        </Alert>
      </ModalBody>
      <ModalFooter className="d-flex justify-content-between">
        <VibrateButton color="success" onClick={props.handleOk}>
          Ok!
        </VibrateButton>
      </ModalFooter>
    </Modal>
  );
};

RaidDirectionsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleOk: PropTypes.func.isRequired,
};

export default RaidDirectionsModal;
