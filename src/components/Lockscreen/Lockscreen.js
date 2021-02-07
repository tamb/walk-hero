import React from "react";
import PropTypes from "prop-types";
import { FormGroup, Label, Input } from "reactstrap";

import "./Lockscreen.scss";

function Lockscreen(props) {
  return (
    <div className="Lockscreen">
      <div className="Lockscreen__backdrop"></div>
      <FormGroup>
        <Label for="unlock">Unlock Screen</Label>
        <Input
          type="range"
          name="range"
          min="0"
          max="10"
          value={props.unlockValue}
          onChange={props.setUnlockValue}
          id="unlock"
        />
      </FormGroup>
    </div>
  );
}

Lockscreen.propTypes = {
  unlockValue: PropTypes.number,
  setlockValue: PropTypes.func,
};

export default Lockscreen;
