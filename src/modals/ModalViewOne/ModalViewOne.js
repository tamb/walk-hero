import React from "react";
import { connect } from "substate-connect";

import store, { EVENTS } from "@store/store";
import { VIEWS } from "@utils/enums";

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
      "modals.warning_modal_open": false,
      "modals.instructions_modal_open": true,
    });
  }

  function denyWarning() {
    store.emit(EVENTS.UPDATE_STATE, {
      "modals.warning_modal_open": false,
      "play_state.view": VIEWS.LANDING,
    });
  }

  function cancelEndWalk() {
    store.emit(EVENTS.UPDATE_STATE, {
      "gameState.paused": true,
      "modals.pause_modal_open": true,
      "modals.confirm_end_walk_modal_open": false,
    });
  }

  function toggleSettings() {
    store.emit(EVENTS.UPDATE_STATE, {
      "modals.settings_modal_open": !store.getProp(
        "modals.settings_modal_open"
      ),
    });
  }

  function endWalk() {
    store.emit(EVENTS.UPDATE_STATE, {
      "modals.pause_modal_open": false,
      "modals.confirm_end_walk_modal_open": true,
    });
  }

  function readInstructions() {
    store.emit(EVENTS.UPDATE_STATE, {
      "modals.instructions_modal_open": false,
      "modals.start_modal_open": true,
    });
  }

  function startNewWalk() {
    store.emit(EVENTS.UPDATE_STATE, {
      "modals.start_modal_open": false,
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
      {/* In order */}
      <WiredWarningModal
        acceptWarning={acceptWarning}
        denyWarning={denyWarning}
      />
      <WiredInstructionModal toggle={readInstructions} />
      {/* name modal */}
      <WiredStartModal startNewWalk={startNewWalk} />

      {/* No order here */}
      <WiredConfirmEndWalkModal
        cancelEndWalk={cancelEndWalk}
        confirmEndWalk={endWalk}
      />
      <WiredPauseModal continueWalk={togglePaused} endWalk={endWalk} />
      <WiredSettingsModal toggle={toggleSettings} />
    </React.Fragment>
  );
};

export default ModalViewOne;
