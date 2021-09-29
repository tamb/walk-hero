import React from "react";
import arrayShuffle from "array-shuffle";
import isArraySorted from "is-array-sorted";

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
      level: LEVELS.MEDIUM,
      numbers: arrayShuffle(
        new Array(LEVELS.MEDIUM).fill().map((x, i) => i + 1)
      ),
      gameWon: false,
      tapOne: null,
      tapTwo: null,
    };
    this.game = React.createRef();
    console.log(this);
  }

  componentDidMount() {
    this.game.current.addEventListener("swipe", this.swapTile);
    this.game.current.addEventListener("tap", this.swapFromTap);
    this.game.current.addEventListener("touchstart", function (e) {
      e.preventDefault();
    });
  }

  swapFromTap = (e) => {
    this.setState({
      tapOne: this.state.tapOne
        ? this.state.tapOne
        : parseInt(e.target.getAttribute("data-order-index")),
      tapTwo: this.state.tapOne
        ? parseInt(e.target.getAttribute("data-order-index"))
        : null,
    });
    navigator.vibrate(10);
  };

  swapTile = (e) => {
    this.setState({
      tapOne: null,
      tapTwo: null,
    });
    if (!e.detail.endingElement.closest("#testswipe")) return;
    const startingIndex =
      e.detail.startingElement.getAttribute("data-order-index");
    const endingIndex = e.detail.endingElement.getAttribute("data-order-index");
    const newNumbers = this.state.numbers.slice();
    const newNumbers2 = this.state.numbers.slice();
    const newNumbers3 = this.state.numbers.slice();
    const out1 = newNumbers.splice(startingIndex, 1);
    const out2 = newNumbers2.splice(endingIndex, 1);
    newNumbers3[startingIndex] = out2[0];
    newNumbers3[endingIndex] = out1[0];

    this.setState({ numbers: newNumbers3 }, this.isInOrder);
    navigator.vibrate(10);
  };

  isInOrder = () => {
    if (isArraySorted(this.state.numbers)) {
      this.game.current.removeEventListener("swipe", this.swapTile);
      this.setState({ gameWon: true }, () => {
        navigator.vibrate(10, 10, 10, 100, 100);
      });
    }
  };

  isTapped = (index) => {
    if (index === this.state.tapOne || index === this.state.tapTwo) {
      return "bg-secondary-light shadow-sm";
    }
    return "";
  };

  renderTiles = () => {
    return new Array(this.state.level).fill().map((x, i) => {
      return (
        <div
          data-number={this.state.numbers[i]}
          data-order-index={i}
          className={`border d-flex justify-content-center align-items-center text-lg ${this.isTapped(
            i
          )}`}
          style={{
            width: `${100 / Math.sqrt(this.state.level)}%`,
            height: `${100 / Math.sqrt(this.state.level)}%`,
          }}
          key={i}
        >
          {this.state.numbers[i]}
        </div>
      );
    });
  };

  render() {
    return (
      <React.Fragment>
        <h2>Order the Tiles</h2>
        {this.state.gameWon && <p class="lead">YOU DID IT!</p>}
        <div
          id="testswipe"
          ref={this.game}
          className="d-flex flex-wrap bg-light"
          style={{ height: "50vh" }}
        >
          {this.renderTiles()}
        </div>
      </React.Fragment>
    );
  }
}

export default Reorder;
