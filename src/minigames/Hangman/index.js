import { Component } from "inferno";

import { styled } from "../styled";
import words from "../data/words.json";

const BlankWord = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
`;

const Alphabet = styled("div")`
  display: flex;
  flex-wrap: wrap;
  padding: 2vw;
  justify-content: space-evenly;
`;

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
  Z: "Z"
};

export default class Hangman extends Component {
  constructor(props) {
    super(props);
    this.state = {
      word: this.randomWord(),
      gameStatus: 'playing',
      guessedLetters: {},
      foundLetters: {}
    };

    this.emojis = {
      0: "😐",
      1: "😒",
      2: "😢",
      3: "😭",
      4: "😵",
      5: '🤢',
      6: "🤮",
      7: "☠️",
      8: "⚰️",
      9: "🧟‍",
    };
  }

  componentDidMount(){
    this.setState({numberOfDashes: this.state.word.length});
  }

  randomWord = () => {
    return words.words[Math.floor(Math.random() * words.words.length)];
  };

  makeBlanks = _word => {
    let numberOfDashes = this.state.numberOfDashes;
    const word = _word.split("").map((letter, i) => {
      if (this.state.foundLetters[letter]) {
        return <span>{letter}&nbsp;</span>;
      } else {
        numberOfDashes = (++i);
        return <span>_&nbsp;</span>;
      }
    });
    if(!numberOfDashes === this.state.numberOfDashes){
      this.setState({numberOfDashes});
    }
    return word;
  };

  notTheLetter = _letter => {
    const newGL = Object.assign({}, this.state.guessedLetters);
    newGL[_letter] = _letter;
    this.setState({ guessedLetters: newGL }, this.checkGameStatus);
  };

  thisIsTheLetter = _letter => {
    const newFL = Object.assign({}, this.state.foundLetters);
    newFL[_letter] = _letter;
    this.setState({ foundLetters: newFL }, this.checkGameStatus);
  };

  checkGameStatus = () => {
    if (Object.keys(this.state.guessedLetters).length  === Object.keys(this.emojis)) {
      this.setState({gameStatus: 'lost'});
    } else if (this.state.numberOfDashes === 0){
      this.setState({gameStatus: 'won'});
    }
  };

  checkIfLetterIsInWord = _letter => {
    const bool = this.state.word.indexOf(_letter) > -1;
    console.log(`${_letter} is${bool ? "" : " not"} in ${this.state.word}`);
    bool ? this.thisIsTheLetter(_letter) : this.notTheLetter(_letter);
  };

  makeAlphabet = () => {
    const { guessedLetters, foundLetters } = this.state;

    return Object.keys(ALPHABET).map(letter => {
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

  render = () => {
    return (
      <div>
        <BlankWord>
          <div>{this.makeBlanks(this.state.word)}</div>
        </BlankWord>
        <Alphabet>{this.makeAlphabet()}</Alphabet>
        <div>
          <p>Guessed Letters:</p>
          {this.showGuessedLetters()}
        </div>
      </div>
    );
  };
}