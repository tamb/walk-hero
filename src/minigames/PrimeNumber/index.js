import { Component } from "inferno";

import "./index.scss";
import { primeNumbers, range } from "../data/primeNumbers";

const Buttons = props => {
  return (
    <div class="prime-number__buttons">
      <button onClick={() => props.clickHandler(true)}>Yes</button>
      <button onClick={() => props.clickHandler(false)}>No</button>
    </div>
  );
};

class PrimeNumber extends Component {
  constructor(props) {
    super(props);
    this.state = {
      answeredCorrect: false,
      number: this.randomIntFromInterval()
    };
  }
  randomIntFromInterval = (min = range.min, max = range.max) => {
    let number = Math.floor(Math.random() * (max - min + 1) + min);
    if (number % 2 === 0) {
      ++number;
    }
    if (number % 5 === 0) {
      number += 2;
    }
    return number;
  };

  clickHandler = bool => {
    this.setState(
      {
        answeredCorrect:
          bool === !(primeNumbers.indexOf(this.state.number) !== -1),
        number: this.randomIntFromInterval()
      },
      console.log(this.state.answeredCorrect)
    );
  };

  render = () => {
    return (
      <div class="prime-number">
        <p class="prime-number__question">
          Is <span class="number">{this.state.number}</span> a prime number?
        </p>
        <Buttons clickHandler={this.clickHandler} />
      </div>
    );
  };
}

export default PrimeNumber;
