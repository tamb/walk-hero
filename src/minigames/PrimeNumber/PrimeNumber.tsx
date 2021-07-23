import React from "react";
import randomInteger from "random-int";

import { primeNumbers, range } from "./../../data/primenumbers";
import "./PrimeNumber.scss";

function Buttons(props: any) {
  return (
    <div className="prime-number__buttons">
      <button onClick={() => props.clickHandler(true)}>Yes</button>
      <button onClick={() => props.clickHandler(false)}>No</button>
    </div>
  );
}

function PrimeNumber(props: any) {
  const [answeredCorrect, setAnsweredCorrect] = React.useState(false);
  const [number, setNumber] = React.useState(randomIntFromInterval());

  function randomIntFromInterval() {
    let number = randomInteger(range.min, range.max);
    if (number % 2 === 0) {
      ++number;
    }
    if (number % 5 === 0) {
      number += 2;
    }
    return number;
  }

  function clickHandler(bool: boolean) {
    setAnsweredCorrect(bool === !(primeNumbers.indexOf(number) !== -1));
    setNumber(randomIntFromInterval());
  }

  return (
    <div className="prime-number">
      <p className="prime-number__question">
        Is <span className="number">{number}</span> a prime number?
      </p>
      <Buttons clickHandler={clickHandler} />
    </div>
  );
}

export default PrimeNumber;
