import React from "react";

class SliderPrecision extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };

    this.slider = React.createRef();
    this.interval = null;
    this.lastEnd = 1;
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      if (this.slider.current.value >= 30) {
        this.lastEnd = -1;
      }
      if (this.slider.current.value <= 0) {
        this.lastEnd = 1;
      }

      if (this.lastEnd > 0) {
        this.slider.current.value++;
      } else {
        this.slider.current.value--;
      }
    }, 1);
  }

  stopValue = () => {
    clearInterval(this.interval);
  };

  render() {
    return (
      <div>
        <input
          ref={this.slider}
          type="range"
          min="0"
          max="30"
          value={this.state.value}
        />

        <button type="button" onClick={this.stopValue}>
          Stop
        </button>
      </div>
    );
  }
}

export default SliderPrecision;
