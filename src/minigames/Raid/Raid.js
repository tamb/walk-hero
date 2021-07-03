import React from "react";
import randomInteger from "random-int";

import Countdown from "@components/Countdown/Countdown";
import "./Raid.scss";

const bad = ["👹", "👿", "😠"];
const good = ["👶", "😝", "😬"];

class Raid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      villainsLeft: 5,
      civiliansKilled: 0,
      movesLeft: 5 + 3,
      chaos: null,
      gameStarted: false,
    };
    this.interval = null;
    this.startInterval = null;
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }
  hitVillain = () => {
    this.setState({
      villainsLeft: this.state.villainsLeft - 1,
    });
  };

  hitCivilian = () => {
    this.setState({
      civiliansKilled: this.state.civiliansKilled + 1,
    });
  };

  startInterval = () => {
    this.startInterval = setInterval(() => {
      if (this.countdown === 0) {
        clearInterval(this.startInterval);
        return;
      }
      this.setState({
        countdown: this.state.countdown - 1,
      });
    }, 1000);
  };

  startGame = () => {
    this.setState(
      {
        gameStarted: true,
        chaos: <div className="Raid__chaos">{this.renderButtons()}</div>,
      },
      () => {
        this.interval = setInterval(this.renderChaos, 2000);
      }
    );
  };

  renderVillain = (key) => {
    return (
      <button key={key} type="button" onClick={this.hitVillain}>
        {bad[randomInteger(0, bad.length - 1)]}
      </button>
    );
  };

  renderCivilian = (key) => {
    return (
      <button key={key} type="button" onClick={this.hitCivilian}>
        {good[randomInteger(0, good.length - 1)]}
      </button>
    );
  };

  renderChaos = () => {
    this.setState({
      movesLeft: this.state.movesLeft - 1,
      chaos: <div className="Raid__chaos">{this.renderButtons()}</div>,
    });
  };

  renderButtons = () => {
    const villain = randomInteger(0, 2);

    return new Array(3).fill().map((x, i) => {
      if (villain === i) {
        return this.renderVillain(i);
      } else {
        return this.renderCivilian(i);
      }
    });
  };

  render() {
    return (
      <div className="Raid">
        <p>Villains left: {this.state.villainsLeft}</p>
        <p>Civilians Killed: {this.state.civiliansKilled}</p>
        <p>Moves Left: {this.state.movesLeft}</p>
        <p>Enemies: {[...bad]}</p>
        <p>Good: {[...good]}</p>
        {this.state.gameStarted && (
          <div className="Raid__btn-row">{this.state.chaos}</div>
        )}

        {!this.state.gameStarted && <Countdown onGo={this.startGame} />}
      </div>
    );
  }
}

export default Raid;
