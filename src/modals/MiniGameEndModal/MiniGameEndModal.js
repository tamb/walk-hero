import React from "react";
import PropTypes from "prop-types";
import { Modal, ModalHeader, ModalFooter, ModalBody, Alert } from "reactstrap";
import { useHistory } from "react-router-dom";

import store, { STORE_EVENT } from "./../../store/store";
import { MINIGAME_STATUS } from "./../../utils/enums";
import VibrateButton from "./../../components/VibrateButton/VibrateButton";

const PRIZE = {
  cash: [4, -3],
  life: [0.25, -1],
  resources: [1, -1],
};

const MiniGameEndModal = (props) => {
  const browserHistory = useHistory();

  function handleOk() {
    browserHistory.goBack();
    store.emit(STORE_EVENT.UPDATE_STATE, {
      "mini_games.play_status": MINIGAME_STATUS.NOT_PLAYING,
    });
  }

  function handlePlayAgain() {
    store.emit(STORE_EVENT.UPDATE_STATE, {
      "mini_games.play_status": MINIGAME_STATUS.PLAYING,
      $type: STORE_EVENT.REPLAY_MINI
    });
  }

  return (
    <Modal centered backdrop="static" isOpen={props.isOpen}>
      <ModalHeader>You {props.won ? "win" : "lose"}!</ModalHeader>
      {props.msg && (
        <Alert color={props.won ? "success" : "warning"}>{props.msg}</Alert>
      )}
      <ModalBody className="text-center">
        <div>
          <span>
            💰{props.won ? `+${PRIZE.cash[0]}` : `${PRIZE.cash[1]}`}
            &nbsp;&nbsp;&nbsp;
          </span>
          <span>
            💖{props.won ? `+${PRIZE.life[0]}` : `${PRIZE.life[1]}`}
            &nbsp;&nbsp;&nbsp;
          </span>
          <span>
            📦{props.won ? `+${PRIZE.resources[0]}` : `${PRIZE.resources[1]}`}
            &nbsp;&nbsp;
          </span>
        </div>
      </ModalBody>
      <ModalFooter className="d-flex justify-content-between">
        <VibrateButton color="info" onClick={handlePlayAgain}>
          Play again!
        </VibrateButton>
        <VibrateButton color="success" onClick={handleOk}>
          Ok!
        </VibrateButton>
      </ModalFooter>
    </Modal>
  );
};

MiniGameEndModal.propTypes = {
  won: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

MiniGameEndModal.defaultProps = {
  isOpen: false,
  won: false,
};

export default MiniGameEndModal;
