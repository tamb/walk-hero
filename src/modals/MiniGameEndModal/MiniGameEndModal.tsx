import React from "react";
import PropTypes from "prop-types";
import { Modal, ModalHeader, ModalFooter, ModalBody, Alert } from "reactstrap";
import { useNavigate } from "react-router-dom";

import store, { STORE_EVENT } from "../../store/store";
import { MINIGAME_STATUS } from "../../utils/enums";
import VibrateButton from "../../components/VibrateButton/VibrateButton";

const PRIZE = {
  cash: [4, -3],
  life: [0.25, -1],
  resources: [1, -1],
};

const STORE_FIELDS = {
  status: "minigames.play_status",
};

interface IMiniGameEndModalProps {
  isOpen: boolean;
  won: boolean;
  msg: string | React.ReactNode | null;
}

const MiniGameEndModal = ({ isOpen = false, won = false, msg = null }: IMiniGameEndModalProps) => {
  const navigate = useNavigate();

  function handleOk(): void {
    navigate(-1);
    store.emit(STORE_EVENT.UPDATE_STATE, {
      [STORE_FIELDS.status]: MINIGAME_STATUS.NOT_PLAYING,
    });
  }

  function handlePlayAgain(): void {
    store.emit(STORE_EVENT.UPDATE_STATE, {
      [STORE_FIELDS.status]: MINIGAME_STATUS.PLAYING,
      $type: STORE_EVENT.REPLAY_MINI,
    });
  }

  return (
    <Modal centered backdrop="static" isOpen={isOpen}>
      <ModalHeader>You {won ? "win" : "lose"}!</ModalHeader>
      {msg && <Alert color={won ? "success" : "warning"}>{msg}</Alert>}
      <ModalBody className="text-center">
        <div>
          <span>
            💰{won ? `+${PRIZE.cash[0]}` : `${PRIZE.cash[1]}`}
            &nbsp;&nbsp;&nbsp;
          </span>
          <span>
            💖{won ? `+${PRIZE.life[0]}` : `${PRIZE.life[1]}`}
            &nbsp;&nbsp;&nbsp;
          </span>
          <span>
            📦{won ? `+${PRIZE.resources[0]}` : `${PRIZE.resources[1]}`}
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
  msg: PropTypes.node,
};

export default MiniGameEndModal;
