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
      level: LEVELS.EASY,
    };
    this.game = React.createRef();
    console.log(this);
  }

  componentDidMount() {
    this.game.current.addEventListener("swipeleft", this.swapTile);
    this.game.current.addEventListener("swiperight", this.swapTile);
    this.game.current.addEventListener("swipeup", this.swapTile);
    this.game.current.addEventListener("swipedown", this.swapTile);
  }

  swapTile = (e) => {
    console.log(e);
    const x = e.target.previousElementSibling;
    const y = e.target.nextElementSibling;
    console.log(x);
    console.log(y);
  };

  renderTiles = () => {
    const numbers = arrayShuffle(
      new Array(this.state.level).fill().map((x, i) => i + 1)
    );

    return new Array(this.state.level).fill().map((x, i) => {
      return (
        <div
          data-number={numbers[i]}
          data-order-index={i}
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
      <React.Fragment>
        <h2>Order the Tiles</h2>
        <div
          id="testswipe"
          ref={this.game}
          className="d-flex flex-wrap"
          style={{ height: "50vh" }}
        >
          {this.renderTiles()}
        </div>
      </React.Fragment>
    );
  }
}

export default Reorder;
