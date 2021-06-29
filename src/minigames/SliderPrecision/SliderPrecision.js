import React from "react";
import randomInteger from "random-int";

import "./SliderPrecision.scss";
class SliderPrecision extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sliding: false,
    };

    // this.slider = React.createRef();
    this.pointer = React.createRef();
    this.firstPost = React.createRef();
    this.finalPost = React.createRef();
    this.interval = null;
    this.direction = "+";
    this.pointerValue = 0;
    this.firstPostInteger = null;
  }

  componentDidMount() {
    this.generateGoals();

    if (this.state.sliding) {
      this.startInterval();
    }
  }

  generateGoals = () => {
    this.firstPostInteger = randomInteger(0, 90);
    this.firstPost.current.style.left = `calc(${this.firstPostInteger}% - 8px)`;
    this.finalPost.current.style.left = `calc(${
      this.firstPostInteger + 10
    }% - 8px)`;
  };

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
    console.log(this);
    this.setState({
      won:
        this.pointerValue >= this.firstPostInteger &&
        this.pointerValue <= this.firstPostInteger + 10,
    });
  };

  startInterval = () => {
    this.interval = setInterval(() => {
      if (this.direction === "+") {
        this.pointer.current.style.left = `${++this.pointerValue}%`;
      }
      if (this.direction === "-") {
        this.pointer.current.style.left = `${--this.pointerValue}%`;
      }
    }, 1);
  };

  render() {
    return (
      <div>
        <div className="SliderPrecision__range">
          <div className="SliderPrecision__pointer" ref={this.pointer}></div>
          <div
            className="SliderPrecision__first-post"
            ref={this.firstPost}
          ></div>
          <div
            className="SliderPrecision__final-post"
            ref={this.finalPost}
          ></div>
        </div>

        <button type="button" onClick={this.handleClick}>
          {this.state.sliding ? "Stop" : "Start"}
        </button>
        <button type="button" onClick={this.generateGoals}>
          New Posts
        </button>
        <div>{this.state.won ? "You won" : ""}</div>
      </div>
    );
  }
}

export default SliderPrecision;
