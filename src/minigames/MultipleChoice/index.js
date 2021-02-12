import { Component } from "inferno";
import PropTypes from "prop-types";
import { styled } from '../styled';

const MultipleChoiceStyles = styled('div')`
  display: flex;
`;

const Flag = styled('span')`
  font-size: 4rem;
`;

class MultipleChoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pairedDown: []
    };
  }
  /**
   * Shuffles array in place. ES6 version
   * @param {Array} a items An array containing the items.
   */
  shuffle = a => {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  renderQuestion = () => {
    const smallList = this.shuffleAndMinimizeChoices();
    const { amountToShow, img } = this.props;
    const correctIndex = this.randomIntFromInterval(0, amountToShow - 1);

    return (
        <div>
            {this.props.question} {img? <Flag role="img" aria-label="flag">{smallList[correctIndex].entity}</Flag> : smallList[correctIndex].entity}?
            {this.renderChoices(correctIndex, smallList)}
        </div>
    );
  };

  renderChoices = (correctIndex, list) => {

    return list.map((choice, i) => {
      if (i === correctIndex) {
        return (
          <button type="button" onClick={() => this.props.onCorrect()} key={i}>
            {choice.answer}
          </button>
        );
      } else {
        return (
          <button type="button" onClick={() => this.props.onIncorrect()} key={i}>
            {choice.answer}
          </button>
        );
      }
    });
  };

  shuffleAndMinimizeChoices = () => {
    const { choices, amountToShow } = this.props;
    return this.shuffle(choices).slice(0, amountToShow);
  };

  randomIntFromInterval(
    min,
    max // min and max included
  ) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  render() {
    return <MultipleChoiceStyles>{this.renderQuestion()}</MultipleChoiceStyles>;
  }
}

MultipleChoice.propTypes = {
  choices: PropTypes.array.isRequired,
  amountToShow: PropTypes.number.isRequired,
  question: PropTypes.string.isRequired,
  img: PropTypes.bool,
  onCorrect: PropTypes.func.isRequired,
  onIncorrect: PropTypes.func.isRequired,
};

MultipleChoice.defaultProps = {
  choices: [],
  amountToShow: 4,
  img: false,
  onCorrect: ()=>alert('correct!'),
  onIncorrect: ()=>alert('wrong!'),
};

export default MultipleChoice;
