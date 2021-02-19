import React from "react";
import { connect } from "substate-connect";

import store, { EVENTS } from "@store/store";

// Modals
import ConfirmEndWalkModal from "@modals/ConfirmEndWalkModal/ConfirmEndWalkModal";
import InstructionModal from "@modals/InstructionModal/InstructionModal";
import PauseModal from "@modals/PauseModal/PauseModal";
import SettingsModal from "@modals/SettingsModal/SettingsModal";
import StartModal from "@modals/StartModal/StartModal";
import WarningModal from "@modals/WarningModal/WarningModal";

const WiredConfirmEndWalkModal = connect(store, {
  isOpen: "modals.confirm_end_walk_modal_open",
})(ConfirmEndWalkModal);

const WiredInstructionModal = connect(store, {
  isOpen: "modals.instructions_modal_open",
})(InstructionModal);

const WiredPauseModal = connect(store, {
  isOpen: "modals.pause_modal_open",
})(PauseModal);

const WiredSettingsModal = connect(store, {
  isOpen: "modals.settings_modal_open",
  vibrationsOn: "game_settings.vibrations",
  // much more
})(SettingsModal);

const WiredStartModal = connect(store, {
  isOpen: "modals.start_modal_open",
})(StartModal);

const WiredWarningModal = connect(store, {
  isOpen: "modals.warning_modal_open",
})(WarningModal);

const ModalViewOne = () => {
  function acceptWarning() {
    store.emit(EVENTS.UPDATE_STATE, {
      "modals.warningModalOpen": false,
      "modals.instructionsModalOpen": true,
    });
  }

  function cancelEndWalk() {
    store.emit(EVENTS.UPDATE_STATE, {
      "gameState.paused": true,
      "modals.pauseModalOpen": true,
      "modals.confirmEndWalkModalOpen": false,
    });
  }

  function dataModalToggle() {
    store.emit(EVENTS.UPDATE_STATE, {
      "modals.settings_modal_open": store.getProp("modals.settings_modal_open"),
    });
  }

  function endWalk() {
    store.emit(EVENTS.UPDATE_STATE, {
      "modals.pauseModalOpen": false,
      "modals.confirmEndWalkModalOpen": true,
    });
  }

  function readInstructions() {
    store.emit(EVENTS.UPDATE_STATE, {
      "modals.instructions_modal_open": false,
      "modals.start_modal_open": true,
    });
  }

  function togglePaused() {
    const bool = !store.getProp("play_state.paused");
    store.emit(EVENTS.UPDATE_STATE, {
      "play_state.paused": bool,
      $type: bool ? "PAUSED" : "UNPAUSED",
    });
  }

  return (
    <React.Fragment>
      <WiredConfirmEndWalkModal />
      <WiredInstructionModal />
      <WiredPauseModal />
      <WiredSettingsModal />
      <WiredWarningModal />
      <WiredStartModal />
    </React.Fragment>
  );
};

export default ModalViewOne;
