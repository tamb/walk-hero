import React from "react";
import { connect } from "substate-connect";

import store from "@store/store";

const Hangman = React.lazy(() => import("@minigames/Hangman/Hangman"));
const SliderPrecision = React.lazy(() =>
  import("@minigames/SliderPrecision/SliderPrecision")
);
const RadarGame = React.lazy(() => import("@minigames/RadarGame/RadarGame"));
const Raid = React.lazy(() => import("@minigames/Raid/Raid"));

class MiniGames extends React.Component {
  state = {
    currentGame: null,
  };

  getMiniGame = (event) => {
    this.setState({
      currentGame: event.target.getAttribute("data-minigame-type"),
    });
  };

  renderList = () => {
    return (
      <ul>
        <li>
          <button onClick={this.getMiniGame} data-minigame-type="hangman">
            hangman
          </button>
        </li>
        <li>
          <button
            onClick={this.getMiniGame}
            data-minigame-type="sliderprecision"
          >
            slider precision
          </button>
        </li>
        <li>
          <button onClick={this.getMiniGame} data-minigame-type="radargame">
            Radar Game
          </button>
        </li>
        <li>
          <button onClick={this.getMiniGame} data-minigame-type="raid">
            Raid
          </button>
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
        {this.state.currentGame === "raid" && (
          <React.Suspense fallback={this.renderList()}>
            <Raid />
          </React.Suspense>
        )}
        {this.state.currentGame === "sliderprecision" && (
          <React.Suspense fallback={this.renderList()}>
            <SliderPrecision />
          </React.Suspense>
        )}
        {this.state.currentGame === "radargame" && (
          <React.Suspense fallback={this.renderList()}>
            <RadarGame />
          </React.Suspense>
        )}
      </React.Fragment>
    );
  }
}

export default connect(store, {
  mini_games: "mini_games",
})(MiniGames);
