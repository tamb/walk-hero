import React from "react";
import PropTypes from "prop-types";
import { FormGroup, Label, Input } from "reactstrap";
import {connect} from "substate-connect";

import store from "@store/store";

import "./Lockscreen.scss";

function Lockscreen(props) {

  function setUnlockValue(event){
    store.emit("UPDATE_STATE", {"play_state.unlock_value": event.target.value});
  }


  return (
    <div className="Lockscreen">
      <div className="Lockscreen__backdrop"></div>
      <FormGroup>
        <Label for="unlock">Unlock Screen >>></Label>
        <Input
          type="range"
          name="range"
          min="0"
          max="100"
          step="5"
          value={props.unlockValue}
          onChange={setUnlockValue}
          id="unlock"
        />
      </FormGroup>
    </div>
  );
}

Lockscreen.propTypes = {
  unlockValue: PropTypes.number,
};

const WiredLockScreen = connect(store, {
  unlockValue: "play_state.unlock_value"
})(Lockscreen);

export default Lockscreen;
