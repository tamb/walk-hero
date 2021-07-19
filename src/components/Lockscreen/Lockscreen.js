import React from "react";
import PropTypes from "prop-types";
import { FormGroup, Label, Input } from "reactstrap";

import store from "../../store/store";

import "./Lockscreen.scss";

function Lockscreen(props) {
  // LOCKSCREEN

  function handleLockScreenSlider(e) {
    store.emit("LOCKSCREEN_SLIDE", e);
  }

  return (
    <div className="Lockscreen">
      <div className="Lockscreen__backdrop"></div>
      <FormGroup>
        <Label for="unlock">Unlock Screen &gt;&gt;&gt;</Label>
        <Input
          type="range"
          name="range"
          min="0"
          max="100"
          step="5"
          value={props.unlockValue}
          onChange={handleLockScreenSlider}
          id="unlock"
        />
      </FormGroup>
    </div>
  );
}

Lockscreen.propTypes = {
  unlockValue: PropTypes.number,
};

export default Lockscreen;
