import React from "react";
import randomInteger from "random-int";

import store, {STORE_EVENT} from "@store/store";
import Countdown from "@components/Countdown/Countdown";
import VibrateButton from "@components/VibrateButton/VibrateButton";
import RaidDirectionsModal from "./RaidDirectionsModal";
import RaidGameStatusModal from "./RaidGameStatusModal";
import "./Raid.scss";

const ENEMIES = ["👹", "👿", "😠"];
const CIVILIANS = ["👶", "😝", "😬"];
const GAMESTATUS = {
  playing: 0,
  won: 1,
  lost: 2,
};

function Raid() {
  const [enemiesLeft, setEnemiesLeft] = React.useState(5);
  const [civiliansHit, setCiviliansHit] = React.useState(0);
  const [movesLeft, setMoveLeft] = React.useState(8);
  const [chaos, setChaos] = React.useState(null);
  const [gameStarted, setGameStarted] = React.useState(false);
  const [directions, setDirections] = React.useState(true);
  const [gameStatus, setGameStatus] = React.useState(GAMESTATUS.playing);

  const $btnRow = React.createRef();

  React.useEffect(() => {
    window.addEventListener("animationiteration", handleAnimationEnd);
    return () => {
      window.removeEventListener("animationiteration", handleAnimationEnd);
    };
  });

  React.useEffect(() => {
    if (gameStatus === GAMESTATUS.playing && enemiesLeft === 0) {
      setGameStatus(GAMESTATUS.won);
      return;
    }
    if (gameStatus === GAMESTATUS.playing && civiliansHit === 3) {
      setGameStatus(GAMESTATUS.lost);
      return;
    }
  }, [gameStatus, enemiesLeft, civiliansHit]);

  function handleAnimationEnd(event) {
    if (event.animationName === "popup") {
      $btnRow.current.focus();
      renderChaos();
    }
  }

  function hitEnemy() {
    setEnemiesLeft(enemiesLeft - 1);
  }

  function hitCivilian() {
    setCiviliansHit(civiliansHit + 1);
  }

  function closeDirections() {
    setDirections(false);
  }

  function startGame() {
    setGameStarted(true);
    setChaos(<div className="Raid__chaos">{renderButtons()}</div>);
  }

  function renderEnemy(key) {
    return (
      <VibrateButton
        key={key}
        pattern={[500]}
        type="button"
        onClick={hitEnemy}
        color="link"
        className="Raid__enemy"
      >
        {ENEMIES[randomInteger(0, ENEMIES.length - 1)]}
      </VibrateButton>
    );
  }

  function renderCivilian(key) {
    return (
      <VibrateButton
        key={key}
        pattern={[10, 10, 10]}
        type="button"
        onClick={hitCivilian}
        color="link"
        className="Raid__civilian"
      >
        {CIVILIANS[randomInteger(0, CIVILIANS.length - 1)]}
      </VibrateButton>
    );
  }

  function renderChaos() {
    setMoveLeft(movesLeft - 1);
    setChaos(<div className="Raid__chaos">{renderButtons()}</div>);
  }

  function renderButtons() {
    const enemy = randomInteger(0, 2);

    return new Array(3).fill().map((x, i) => {
      if (enemy === i) {
        return renderEnemy(i);
      } else {
        return renderCivilian(i);
      }
    });
  }

  return (
    <div className="Raid">
      <p>Enemies Defeated: {5 - enemiesLeft}/5</p>
      <p>Civilians Remaining: {3 - civiliansHit}/3</p>
      {directions && (
        <RaidDirectionsModal handleOk={closeDirections} isOpen={directions} />
      )}
      {gameStarted && !directions && gameStatus === GAMESTATUS.playing && (
        <div ref={$btnRow} tabIndex="-1" className="Raid__btn-row">
          {chaos}
        </div>
      )}

      {gameStatus !== GAMESTATUS.playing && (
        <RaidGameStatusModal won={gameStatus === GAMESTATUS.won} />
      )}
      {!gameStarted && !directions && <Countdown onGo={startGame} />}
    </div>
  );
}

export default Raid;
