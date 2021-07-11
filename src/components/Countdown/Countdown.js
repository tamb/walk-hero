import React from "react";
import PropTypes from "prop-types";

const READY = "Get Ready...";
const GO = "Go!";

class Countdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: READY,
      hide: false,
    };

    this.interval = null;
  }

  componentDidMount() {
    this.interval = setInterval(this.setCount, 1000);
  }

  count = () => {
    return this.state.count === READY
      ? this.props.max
      : this.state.count === 1
      ? GO
      : this.state.count - 1;
  };

  setCount = () => {
    if (this.state.count === GO) {
      clearInterval(this.interval);
      this.setState({ hide: true }, this.props.onGo);
    } else {
      this.setState({
        count: this.count(),
      });
    }
  };

  render() {
    return (
      <React.Fragment>
        {!this.state.hide && (
          <div className="Countdown">{this.state.count}</div>
        )}
      </React.Fragment>
    );
  }
}

Countdown.propTypes = {
  max: PropTypes.number,
  onGo: PropTypes.func,
};

Countdown.defaultProps = {
  max: 3,
  onGo: () => console.warn("no onGo prop"),
};

export default Countdown;
