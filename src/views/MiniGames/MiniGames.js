import React from "react";
import { connect } from "substate-connect";

import store from "@store/store";

const Hangman = React.lazy(() => import("@minigames/Hangman/Hangman"));
const SliderPrecision = React.lazy(() =>
  import("@minigames/SliderPrecision/SliderPrecision")
);
class MiniGames extends React.Component {
  state = {
    currentGame: null,
  };
  getHangman = () => {
    this.setState({
      currentGame: "hangman",
    });
  };

  getSliderPrecision = () => {
    this.setState({
      currentGame: "sliderprecision",
    });
  };

  renderList = () => {
    return (
      <ul>
        <li>
          <button onClick={this.getHangman}>hangman</button>
        </li>
        <li>
          <button onClick={this.getSliderPrecision}>slider precision</button>
        </li>
      </ul>
    );
  };
  render() {
    return (
      <React.Fragment>
        {this.state.currentGame === null && this.renderList()}

        <div>
          <p>Lives: {this.props.mini_games.lives}</p>
          <p>Resources: {this.props.mini_games.resources}</p>
          <p>Cash: {this.props.mini_games.cash}</p>
        </div>
        {this.state.currentGame === "hangman" && (
          <React.Suspense fallback={this.renderList()}>
            <Hangman />
          </React.Suspense>
        )}
        {this.state.currentGame === "sliderprecision" && (
          <React.Suspense fallback={this.renderList()}>
            <SliderPrecision />
          </React.Suspense>
        )}
      </React.Fragment>
    );
  }
}

export default connect(store, {
  mini_games: "mini_games",
})(MiniGames);
