import React from "react";
import { connect } from "substate-connect";

import store, { STORE_EVENT } from "@store/store";
import { VIEWS } from "@utils/enums";

// Modals
import ConfirmEndWalkModal from "@modals/ConfirmEndWalkModal/ConfirmEndWalkModal";
import PauseModal from "@modals/PauseModal/PauseModal";
import StartModal from "@modals/StartModal/StartModal";
import WarningModal from "@modals/WarningModal/WarningModal";

const WiredConfirmEndWalkModal = connect(store, {
  isOpen: "ancillaries.confirm_end_walk_modal_open",
})(ConfirmEndWalkModal);

const WiredPauseModal = connect(store, {
  isOpen: "ancillaries.pause_modal_open",
})(PauseModal);

// const WiredSettingsModal = connect(store, {
//   isOpen: "ancillaries.settings_modal_open",
//   vibrationsOn: "game_settings.vibrations",
//   // much more
// })(SettingsModal);

const WiredStartModal = connect(store, {
  isOpen: "ancillaries.start_modal_open",
})(StartModal);

const WiredWarningModal = connect(store, {
  isOpen: "ancillaries.warning_modal_open",
})(WarningModal);

const ModalViewOne = () => {
  function acceptWarning() {
    store.emit(STORE_EVENT.UPDATE_STATE, {
      "ancillaries.warning_modal_open": false,
      "ancillaries.start_modal_open": true,
    });
  }

  function denyWarning() {
    store.emit(STORE_EVENT.UPDATE_STATE, {
      "ancillaries.warning_modal_open": false,
      "play_state.view": VIEWS.LANDING,
    });
  }

  function cancelEndWalk() {
    store.emit(STORE_EVENT.UPDATE_STATE, {
      "gameState.paused": true,
      "ancillaries.pause_modal_open": true,
      "ancillaries.confirm_end_walk_modal_open": false,
    });
  }


  function endWalk() {
    store.emit(STORE_EVENT.UPDATE_STATE, {
      "ancillaries.pause_modal_open": false,
      "ancillaries.confirm_end_walk_modal_open": true,
    });
  }

  function startNewWalk() {
    console.log(STORE_EVENT)
    store.emit(STORE_EVENT.UPDATE_STATE, {
      "ancillaries.start_modal_open": false,
      $type: STORE_EVENT.START_WALK,
    });
  }

  function togglePaused() {
    const bool = !store.getProp("play_state.paused");
    store.emit(STORE_EVENT.UPDATE_STATE, {
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
      {/* name modal */}
      <WiredStartModal startNewWalk={startNewWalk} />

      {/* No order here */}
      <WiredConfirmEndWalkModal
        cancelEndWalk={cancelEndWalk}
        confirmEndWalk={endWalk}
      />
      <WiredPauseModal continueWalk={togglePaused} endWalk={endWalk} />
    </React.Fragment>
  );
};

export default ModalViewOne;
