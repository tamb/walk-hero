import React from "react";

import "./SliderPrecision.scss";
class SliderPrecision extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sliding: false,
    };

    // this.slider = React.createRef();
    this.pointer = React.createRef();
    this.interval = null;
    this.lastEnd = 1;
    this.pointerValue = 0;
  }

  componentDidMount() {
    this.state.sliding ? this.startInterval() : null;
    const x = null;
    // if (this.state.sliding) {
    //   this.startInterval();
    // }
  }

  handleClick = () => {
    this.setState(
      {
        sliding: !this.state.sliding,
      },
      () => {
        if (this.state.sliding) {
          this.startInterval();
        } else {
          this.stopInterval();
        }
      }
    );
  };

  stopInterval = () => {
    clearInterval(this.interval);
    this.interval = null;
  };

  startInterval = () => {
    this.interval = setInterval(() => {
      if (this.pointerValue >= 50) {
        this.lastEnd = -1;
      }
      if (this.pointerValue <= 0) {
        this.lastEnd = 1;
      }
      if (this.lastEnd > 0) {
        this.pointer.current.style.left = `calc(${2 * this.pointerValue++}%)`;
      } else {
        this.pointer.current.style.left = `calc(${
          2 * this.pointerValue--
        }% - 20px)`;
      }
    }, 1);
  };

  render() {
    return (
      <div>
        <div className="SliderPrecision__range">
          <div className="SliderPrecision__pointer" ref={this.pointer}></div>
        </div>

        <button type="button" onClick={this.handleClick}>
          {this.state.sliding ? "Stop" : "Start"}
        </button>
      </div>
    );
  }
}

export default SliderPrecision;
