import React from "react";
import "./SpinnerPrecision.scss";

class SpinnerGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spinning: true,
      scored: false,
    };
    this.domSpinner = React.createRef();
  }

  getRotation = () => {
    console.log(this.domSpinner);
    const st = window.getComputedStyle(this.domSpinner.current, null);
    const tr =
      st.getPropertyValue("-webkit-transform") ||
      st.getPropertyValue("-moz-transform") ||
      st.getPropertyValue("-ms-transform") ||
      st.getPropertyValue("-o-transform") ||
      st.getPropertyValue("transform") ||
      "FAIL";

    // With rotate(30deg)...
    // matrix(0.866025, 0.5, -0.5, 0.866025, 0px, 0px)
    console.log("Matrix: " + tr);

    // rotation matrix - http://en.wikipedia.org/wiki/Rotation_matrix

    const values = tr.split("(")[1].split(")")[0].split(",");
    const a = values[0];
    const b = values[1];
    // const c = values[2];
    // const d = values[3];

    const scale = Math.sqrt(a * a + b * b);

    console.log("Scale: " + scale);

    // arc sin, convert from radians to degrees, round
    // const sin = b / scale;
    // next line works for 30deg but not 130deg (returns 50);
    // const angle = Math.round(Math.asin(sin) * (180/Math.PI));
    const angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));

    console.log("Rotate: " + angle + "deg");
    return angle;
  };

  stopSpinner = () => {
    if (this.props.resetOnSecondTouch && !this.state.spinning) {
      this.setState({ spinning: true });
    } else {
      this.setState({ spinning: false });
    }
    const angle = this.getRotation();
    if (angle <= 45 && angle >= -45) {
      this.setState({ scored: true });
    } else {
      this.setState({ scored: false });
    }
  };

  render() {
    return (
      <div className="SpinnerPrecision">
        <div className="SpinnerPrecision__goal"></div>
        <button
          class={`spinner-game ${this.state.spinning ? "spin" : "pause"} ${this.props.speed}`}
          type="button"
          ref={this.domSpinner}
          onMouseDown={this.stopSpinner}
          spinning={this.state.spinning}
          {...this.props}
        >
          <div>&#9733;</div>
        </button>

        {this.state.scored.toString()}
      </div>
    );
  }
}

SpinnerGame.defaultProps = {
  speed: "s75",
  playState: "running",
};

export default SpinnerGame;
