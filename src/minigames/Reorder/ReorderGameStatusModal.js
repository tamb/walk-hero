import React from "react";
import PropTypes from "prop-types";
import { Modal, ModalHeader, ModalFooter, ModalBody } from "reactstrap";

import VibrateButton from "../../components/VibrateButton/VibrateButton";

/**
 * 
 * 1) Before Game Starts
 *  *) Reset any timers
 *  *) Reset any game board
 *  *) Reset game status 
 */

const ReorderGameStatusModal = (props) => {
  return (
    <Modal centered backdrop="static" isOpen={props.isOpen}>
      <ModalHeader>Reorder!</ModalHeader>
      <ModalBody className="text-center">
        <p>You have {props.won ? "won" : "failed"}!</p>
        <hr />
        <p className="d-flex">
          <span className="Hangman__mage">🙋‍♂️</span>
          <span>
            "
            {props.won
              ? "Thank you so much! You're my hero!"
              : "Oh no!  Thank you for trying..."}
            "
          </span>
        </p>
        <hr />
      </ModalBody>
      <ModalFooter className="d-flex justify-content-between">
        <VibrateButton
          className={"btn-primary-outline"}
          onClick={props.handleMiniGameMenu}
        >
          Game Menu
        </VibrateButton>
        <VibrateButton color="success" onClick={props.handlePlayAgain}>
          Play Again
        </VibrateButton>
      </ModalFooter>
    </Modal>
  );
};

ReorderGameStatusModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handlePlayAgain: PropTypes.func.isRequired,
  handleMiniGameMenu: PropTypes.func.isRequired,
};

export default ReorderGameStatusModal;
