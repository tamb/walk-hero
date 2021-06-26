import React from "react";
import words from "@data/words.json";

import "./Hangman.scss";

// FIXME: Determine when game is won or lost. Consider map for letters and amount of letters);

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

export default class Hangman extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      word: this.randomWord(),
      gameStatus: "playing",
      guessedLetters: {},
      foundLetters: {},
    };

    this.emojis = {
      0: "😐",
      1: "😒",
      2: "😢",
      3: "😭",
      4: "😵",
      5: "🤢",
      6: "🤮",
      7: "☠️",
    };
  }

  randomWord = () => {
    return words.words[Math.floor(Math.random() * words.words.length)];
  };

  makeBlanks = () => {
    return new Array(this.state.word.length).fill().map((item, index) => {
      return (
        <span key={index}>
          {this.state.foundLetters[this.state.word[index]]
            ? this.state.word[index]
            : "_"}
          &nbsp;
        </span>
      );
    });
  };

  notTheLetter = (_letter) => {
    const newGuessedLetter = Object.assign({}, this.state.guessedLetters);
    newGuessedLetter[_letter] = _letter;
    this.setState({ guessedLetters: newGuessedLetter }, this.checkGameStatus);
  };

  thisIsTheLetter = (_letter) => {
    const newFoundLetter = Object.assign({}, this.state.foundLetters);
    newFoundLetter[_letter] = _letter;
    this.setState({ foundLetters: newFoundLetter }, this.checkGameStatus);
  };

  checkGameStatus = () => {
    if (
      Object.keys(this.state.guessedLetters).length ===
      Object.keys(this.emojis).length
    ) {
      this.setState({ gameStatus: "lost" });
    } else if (
      this.state.word
        .split("")
        .every((letter) => this.state.foundLetters[letter])
    ) {
      this.setState({ gameStatus: "won" });
    }
  };

  checkIfLetterIsInWord = (_letter) => {
    const bool = this.state.word.indexOf(_letter) > -1;
    console.log(`${_letter} is${bool ? "" : " not"} in ${this.state.word}`);
    bool ? this.thisIsTheLetter(_letter) : this.notTheLetter(_letter);
  };

  makeAlphabet = () => {
    const { guessedLetters, foundLetters } = this.state;

    return Object.keys(ALPHABET).map((letter) => {
      const disabled =
        guessedLetters[letter] || foundLetters[letter] ? "disabled" : false;

      return (
        <button
          key={letter}
          disabled={disabled}
          onClick={() => this.checkIfLetterIsInWord(letter)}
        >
          {letter}
        </button>
      );
    });
  };

  showGuessedLetters = () => {
    return Object.keys(this.state.guessedLetters).map((letter, index) => {
      return (
        <div>
          <span>{letter}&nbsp;</span>
          <span>{this.emojis[index]}</span>
        </div>
      );
    });
  };

  render() {
    return (
      <div>
        <div className="Hangman__blank-word">
          <div>{this.makeBlanks()}</div>
        </div>
        <div className="Hangman__alphabet">{this.makeAlphabet()}</div>
        <div className="Hangman__guessed-letters">
          <p>Guessed Letters:</p>
          {this.showGuessedLetters()}
        </div>
        <div className="Hangman__status">{this.state.gameStatus}</div>
      </div>
    );
  }
}
