import React from "react";

import words from "@data/words.json";
import store from "@store/store";

import HangmanDirectionsModal from "./HangmanDirectionsModal";
import "./Hangman.scss";

const ALPHABET = {
  A: "A",
  B: "B",
  C: "C",
  D: "D",
  E: "E",
  F: "F",
  G: "G",
  H: "H",
  I: "I",
  J: "J",
  K: "K",
  L: "L",
  M: "M",
  N: "N",
  O: "O",
  P: "P",
  Q: "Q",
  R: "R",
  S: "S",
  T: "T",
  U: "U",
  V: "V",
  W: "W",
  X: "X",
  Y: "Y",
  Z: "Z",
};

const GAMESTATUS = {
  starting: 0,
  playing: 1,
  won: 2,
  lost: 3,
};

const EMOJIES = {
  0: "😐",
  1: "😒",
  2: "😭",
  3: "🤢",
  4: "🤮",
  5: "☠️",
};

const emojiList = ["😐", "😒", "😭", "🤢", "🤮", "☠️"];

function Hangman() {
  const [word] = React.useState(randomWord());
  const [gameStatus, setGameStatus] = React.useState(GAMESTATUS.starting);
  const [guessedLetters, setGuessedLetters] = React.useState([]);
  const [foundLetters, setFoundLetters] = React.useState({});

  React.useEffect(checkGameStatus, [guessedLetters, foundLetters, word]);

  function randomWord() {
    return words.words[Math.floor(Math.random() * words.words.length)];
  }

  function makeBlanks() {
    return new Array(word.length).fill().map((item, index) => {
      return (
        <span key={index}>
          {foundLetters[word[index]] ? word[index] : "_"}
          &nbsp;
        </span>
      );
    });
  }

  function notTheLetter(_letter) {
    const newGuessedLetter = guessedLetters.concat([_letter]);
    setGuessedLetters(newGuessedLetter);
  }

  function thisIsTheLetter(_letter) {
    const newFoundLetter = Object.assign({}, foundLetters);
    newFoundLetter[_letter] = _letter;
    setFoundLetters(newFoundLetter);
  }

  function checkGameStatus() {
    if (Object.keys(guessedLetters).length === Object.keys(EMOJIES).length) {
      setGameStatus(GAMESTATUS.lost);
      store.emit("UPDATE_STATE", {
        "mini_games.cash": store.getProp("mini_games.cash") - 2,
        "mini_games.resources": store.getProp("mini_games.resources") - 1,
        "mini_games.lives": store.getProp("mini_games.lives") - 1,
      });
    } else if (word.split("").every((letter) => foundLetters[letter])) {
      setGameStatus(GAMESTATUS.won);
      store.emit("UPDATE_STATE", {
        "mini_games.cash": store.getProp("mini_games.cash") + 3,
        "mini_games.resources": store.getProp("mini_games.resources") + 1,
      });
    }
  }

  function checkIfLetterIsInWord(_letter) {
    const bool = word.indexOf(_letter) > -1;
    console.log(`${_letter} is${bool ? "" : " not"} in ${word}`);
    bool ? thisIsTheLetter(_letter) : notTheLetter(_letter);
  }

  function makeAlphabet() {
    return Object.keys(ALPHABET).map((letter) => {
      const disabled =
        guessedLetters[letter] || foundLetters[letter] ? "disabled" : false;

      return (
        <button
          key={letter}
          disabled={disabled}
          onClick={() => checkIfLetterIsInWord(letter)}
        >
          {letter}
        </button>
      );
    });
  }

  function renderEmojies() {
    return emojiList.map((em, i) => {
      return (
        <li
          key={i}
          className={`list-inline-item Hangman__health-emoji ${
            guessedLetters[i] ? "hit" : ""
          }`}
        >
          <span>{guessedLetters[i]}&nbsp;</span>
          <span>{em}</span>
        </li>
      );
    });
  }

  function startGame() {
    setGameStatus(GAMESTATUS.playing);
  }

  return (
    <div className="Hangman">
      <ul className="list-unstyled list-inline Hangman__emoji-list">
        {renderEmojies()}
      </ul>
      {(gameStatus === GAMESTATUS.playing || gameStatus === GAMESTATUS.won) && (
        <div className="Hangman__blank-word">
          <div>{makeBlanks()}</div>
        </div>
      )}

      {gameStatus === GAMESTATUS.playing && (
        <React.Fragment>
          <div className="Hangman__alphabet">{makeAlphabet()}</div>
          <div className="Hangman__status">{gameStatus}</div>
        </React.Fragment>
      )}
      {gameStatus === GAMESTATUS.lost && <h2>You have died ☠️</h2>}
      {gameStatus === GAMESTATUS.starting && (
        <HangmanDirectionsModal
          isOpen={gameStatus === GAMESTATUS.starting}
          handleOk={startGame}
        />
      )}
    </div>
  );
}

export default Hangman;
