import React from "react";

import "./SliderPrecision.scss";
class SliderPrecision extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sliding: false,
      difficulty: 4,
      goalStart: 0,
      goalEnd: 0,
      goalMiddle: 0,
      pointerStart: 0,
      pointerEnd: 0,
      pointerMiddle: 0,
      perfect: false,
      accuracy: 0,
    };

    this.range = React.createRef();
    this.pointer = React.createRef();
    this.goal = React.createRef();

    this.pointerInterval = null;
    this.goalInterval = null;
    this.pointerDirection = "+";
    this.goalDirection = "+";
    this.pointerStart = 0;
    this.goalStart = 50;
    this.firstPostInteger = null;
  }

  componentDidMount() {
    window.addEventListener("animationend", (e) => {
      if (e.animationName === "flash-success") {
        this.setState({ perfect: false });
      }
    });
  }

  startSlide = () => {
    console.log(this);
    requestAnimationFrame(this.startPointerInterval);
    requestAnimationFrame(this.startGoalInterval);
  };

  stopSlide = () => {
    this.stopGoalInterval();
    this.stopPointerInterval();
  };

  handleClick = () => {
    this.setState(
      {
        sliding: !this.state.sliding,
      },
      () => {
        if (this.state.sliding) {
          this.startSlide();
        } else {
          this.stopSlide();
        }
      }
    );
  };

  stopPointerInterval = () => {
    if (this.pointerInterval) {
      cancelAnimationFrame(this.pointerInterval);
      const goalBounds = this.goal.current.getBoundingClientRect();
      const pointerBounds = this.pointer.current.getBoundingClientRect();

      const values = {
        goalStart: goalBounds.left,
        goalEnd: goalBounds.left + goalBounds.width,
        goalMiddle: goalBounds.left + goalBounds.width / 2,
        goalWidth: goalBounds.width,
        pointerStart: pointerBounds.left,
        pointerEnd: pointerBounds.left + pointerBounds.width,
        pointerMiddle: pointerBounds.left + pointerBounds.width / 2,
        accuracy:
          100 -
          Math.abs(
            parseFloat(
              (goalBounds.left +
                goalBounds.width / 2 -
                (pointerBounds.left + pointerBounds.width / 2)) /
                (pointerBounds.left + pointerBounds.width / 2)
            ).toFixed(2) * 100
          ),
      };
      this.setState({
        ...values,
        perfect: values.accuracy === 100,
        won:
          values.pointerMiddle >= values.goalStart &&
          values.pointerMiddle <= values.goalEnd,
      });
    }
  };

  startGoalInterval = () => {
    const goalBounds = this.goal.current.getBoundingClientRect();
    const rangeBounds = this.range.current.getBoundingClientRect();
    if (goalBounds.left >= rangeBounds.width - goalBounds.width / 2) {
      this.goalDirection = "-";
    }
    // check to left side
    if (goalBounds.left <= rangeBounds.left) {
      this.goalDirection = "+";
    }
    if (this.goalDirection === "+") {
      this.goal.current.style.transform = `translateX(${
        (++this.goalStart * this.state.difficulty) / 2
      }px)`;
    }
    if (this.goalDirection === "-") {
      this.goal.current.style.transform = `translateX(${
        (--this.goalStart * this.state.difficulty) / 2
      }px)`;
    }
    this.goalInterval = requestAnimationFrame(this.startGoalInterval);
  };

  stopGoalInterval = () => {
    if (this.goalInterval) {
      cancelAnimationFrame(this.goalInterval);
    }
  };

  startPointerInterval = () => {
    const pointerBounds = this.pointer.current.getBoundingClientRect();
    const rangeBounds = this.range.current.getBoundingClientRect();
    // check to right side
    if (pointerBounds.left >= rangeBounds.width - pointerBounds.width / 4) {
      this.pointerDirection = "-";
    }
    // check to left side
    if (pointerBounds.left <= rangeBounds.left) {
      this.pointerDirection = "+";
    }
    if (this.pointerDirection === "+") {
      this.pointer.current.style.transform = `translateX(${
        ++this.pointerStart * this.state.difficulty
      }px)`;
    }
    if (this.pointerDirection === "-") {
      this.pointer.current.style.transform = `translateX(${
        --this.pointerStart * this.state.difficulty
      }px)`;
    }
    this.pointerInterval = requestAnimationFrame(this.startPointerInterval);
  };

  render() {
    return (
      <div>
        <div className="SliderPrecision__range" ref={this.range}>
          <div
            className={`SliderPrecision__pointer ${
              this.state.perfect ? "perfect" : ""
            }`}
            ref={this.pointer}
          ></div>
          <div className="SliderPrecision__goal" ref={this.goal}></div>
        </div>

        <button type="button" onClick={this.handleClick}>
          {this.state.sliding ? "Stop" : "Start"}
        </button>
        <div>{this.state.won ? "You won" : "You lost"}</div>
        <div>
          <p>
            Goal Value = {this.state.goalStart} - {this.state.goalEnd}
          </p>
          <p>Goal Middle = {this.state.goalStart + this.state.goalWidth / 2}</p>
          <p>
            Pointer Value = {this.state.pointerStart} - {this.state.pointerEnd}
          </p>
          <p>Pointer Middle = {this.state.pointerMiddle}</p>
          <p>Range Width = {this.state.rangeWidth}</p>

          <p>Accuracy ={this.state.accuracy}%</p>
          <p>{this.state.perfect ? "PERFECT!" : ""}</p>
        </div>
      </div>
    );
  }
}

export default SliderPrecision;
