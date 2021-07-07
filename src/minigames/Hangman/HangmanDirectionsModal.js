import React from "react";
import PropTypes from "prop-types";
import { Modal, ModalHeader, ModalFooter, ModalBody } from "reactstrap";

import VibrateButton from "@components/VibrateButton/VibrateButton";

const HangmanDirectionsModal = (props) => {
  return (
    <Modal centered backdrop="static" isOpen={true}>
      <ModalHeader>Hangman!</ModalHeader>
      <ModalBody className="text-center">
        <p>An Evil Mage appeared...</p>
        <p>
          🧙: "I will reward thee for thy intellect! I will punish thee for thy
          ignorance!"
        </p>
        <p>☠️ Guess the word before The Evil Wizard poisons you! ☠️</p>
      </ModalBody>
      <ModalFooter className="d-flex justify-content-between">
        <VibrateButton color="success" onClick={props.handleOk}>
          Ok!
        </VibrateButton>
      </ModalFooter>
    </Modal>
  );
};

HangmanDirectionsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleOk: PropTypes.func.isRequired,
};

export default HangmanDirectionsModal;
