import React from "react";

import "./RadarGame.scss";

class RadarGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      radarSize: "sm",
      spinning: true,
      shotsLeft: 5,
      enemies: 3,
    };
  }

  setRadarSize = (event) => {
    this.setState({
      radarSize: event.target.getAttribute("data-radar-size"),
    });
  };

  setRadarSpin = () => {
    this.setState({
      spinning: !this.state.spinning,
    });
  };
  render() {
    return (
      <div>
        <div className="RadarGame__stage" onClick={this.setRadarSpin}>
          {this.state.radarSize === "sm" && (
            <div className="RadarGame__tier RadarGame__tier--sm"></div>
          )}
          <div className="RadarGame__tier RadarGame__tier--md"></div>
          <div className="RadarGame__tier RadarGame__tier--lg"></div>
          <div className="RadarGame__blip"></div>
        </div>
        <div className="RadarGame__btn-row">
          <button
            type="button"
            data-radar-size="sm"
            onClick={this.setRadarSize}
            className={`${this.state.radarSize === "sm" ? "active" : ""}`}
          >
            Short
          </button>
          <button
            type="button"
            data-radar-size="md"
            onClick={this.setRadarSize}
            className={`${this.state.radarSize === "md" ? "active" : ""}`}
          >
            Medium
          </button>
          <button
            type="button"
            data-radar-size="lg"
            onClick={this.setRadarSize}
            className={`${this.state.radarSize === "lg" ? "active" : ""}`}
          >
            Long
          </button>
        </div>
        <div>
          <p>Enemies Left: {this.state.enemies}</p>
          <p>Shots Left: {this.state.shotsLeft}</p>
        </div>
      </div>
    );
  }
}

export default RadarGame;
