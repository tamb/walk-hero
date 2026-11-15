import React from "react";
import arrayShuffle from "array-shuffle";
import isArraySorted from "is-array-sorted";
import { connect } from "../../store/connect";
import PropTypes from "prop-types";

import store from "../../store/store";
import { MINIGAME_STATUS } from "../../utils/enums";
import ReorderDirectionsModal from "./ReorderDirectionsModal";
import ReorderGameStatusModal from "./ReorderGameStatusModal";

const LEVELS = {
  EASY: 9,
  MEDIUM: 16,
  HARD: 25,
  SUPERMAX: 36,
};

class Reorder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      level: LEVELS.MEDIUM,
      seconds: 5 || Math.floor(LEVELS.MEDIUM * 1.75),
      numbers: this.setNumbers(),
      tapOne: null,
      tapTwo: null,
    };
    this.game = React.createRef();
    console.log(this);
  }

  componentDidMount() {
    this.resetGame();
    this.game.current.addEventListener("swipe", this.swapTile);
    this.game.current.addEventListener("tap", this.swapFromTap);
    this.game.current.addEventListener("touchstart", function (e) {
      e.preventDefault();
    });
  }

  resetGame = () => {
    console.log("GAME RESET!");
    this.setState({
      gameWon: false,
      gameStarted: false,
      gameOver: false,
      seconds: 5,
      numbers: this.setNumbers(),
    });
  };

  endGame = () => {
    this.setState({ gameOver: true });
  };

  startGame = () => {
    this.setState({ gameStarted: true }, this.startTimer);
  };

  stopTimer = () => {
    if (this.state.seconds < 1) {
      clearInterval(this.timer);
      this.endGame();
    }
  };

  startTimer = () => {
    this.timer = setInterval(() => {
      this.setState(
        {
          seconds: this.state.seconds - 1,
        },
        this.stopTimer,
      );
    }, 1000);
  };

  setNumbers = () => {
    return arrayShuffle(new Array(LEVELS.MEDIUM).fill().map((x, i) => i + 1));
  };

  swapFromTap = (e) => {
    this.setState({
      tapOne: this.state.tapOne
        ? this.state.tapOne
        : parseInt(e.target.getAttribute("data-order-index")),
      tapTwo: this.state.tapOne ? parseInt(e.target.getAttribute("data-order-index")) : null,
    });
    navigator.vibrate(10);
  };

  swapTile = (e) => {
    this.setState({
      tapOne: null,
      tapTwo: null,
    });
    if (!e.detail.endingElement.closest("#testswipe")) return;
    const startingIndex = e.detail.startingElement.getAttribute("data-order-index");
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
        navigator.vibrate([10, 10, 10, 100, 100, 10, 100]);
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
            i,
          )}`}
          style={{
            width: `${100 / Math.sqrt(this.state.level)}%`,
            height: `${100 / Math.sqrt(this.state.level)}%`,
          }}
          key={i}
        >
          🌾{this.state.numbers[i]}
        </div>
      );
    });
  };

  render() {
    return (
      <React.Fragment>
        <h2 className="text-lg">Order the Crop Bundles</h2>
        {this.state.gameWon && <p class="lead">YOU DID IT!</p>}
        <p>Time left: {this.state.seconds}s</p>
        <div
          id="testswipe"
          ref={this.game}
          className="d-flex flex-wrap bg-light"
          style={{ height: "50vh" }}
        >
          {this.renderTiles()}
        </div>
        <ReorderGameStatusModal
          isOpen={this.state.gameOver}
          won={this.gameWon}
          handlePlayAgain={this.resetGame}
        />
        <ReorderDirectionsModal
          isOpen={this.state.gameStarted === false}
          handleOk={this.startGame}
        />
      </React.Fragment>
    );
  }
}

Reorder.propTypes = {
  status: PropTypes.shape(MINIGAME_STATUS),
};

// export default connect(store, {
//   status: "minigames.minigame_status",
// })(Reorder);
export default Reorder;
