import React from "react";
import arrayShuffle from "array-shuffle";

class Reorder extends React.Component {
  constructor(props) {
    super(props);
    const LEVELS = {
      EASY: 9,
      MEDIUM: 16,
      HARD: 25,
      SUPERMAX: 36,
    };
    this.state = {
      level: LEVELS.SUPERMAX,
    };
    this.game = React.createRef();
    console.log(this);
  }

  componentDidMount() {
    this.game.current.addEventListener("swipeleft", console.log);
    this.game.current.addEventListener("swiperight", console.log);
    this.game.current.addEventListener("swipeup", console.log);
    this.game.current.addEventListener("swipedown", console.log);
  }

  renderTiles = () => {
    const numbers = arrayShuffle(
      new Array(this.state.level).fill().map((x, i) => i + 1)
    );

    return new Array(this.state.level).fill().map((x, i) => {
      return (
        <div
          className="border d-flex justify-content-center align-items-center"
          style={{
            width: `${100 / Math.sqrt(this.state.level)}%`,
            height: `${100 / Math.sqrt(this.state.level)}%`,
          }}
          key={i}
        >
          {numbers[i]}
        </div>
      );
    });
  };

  render() {
    return (
      <div
        id="testswipe"
        ref={this.game}
        className="d-flex flex-wrap"
        style={{ height: "50vh" }}
      >
        {this.renderTiles()}
      </div>
    );
  }
}

export default Reorder;
