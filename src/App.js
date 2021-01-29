import React from "react";
import distFrom from "distance-from";
import { Container, Row, Col } from "reactstrap";

import { toLatLong, toTime } from "./services/Geo";


class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      geoData: {},
      hasLocation: false,
      start: false,
      distanceFromStartCM: null,
    };
  }

  componentDidMount() {
    this.poll = navigator.geolocation.watchPosition(this.success);
    navigator.geolocation.getCurrentPosition(this.setStart);
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.poll);
  }

  setStart = (data) => this.setState({ start: data });

  success = (geoData) => {
    this.setState({
      geoData,
      distanceFromStartCM: distFrom(toLatLong(this.state.start))
        .to(toLatLong(geoData))
        .in("cm"),
      distanceFromStartM: distFrom(toLatLong(this.state.start))
        .to(toLatLong(geoData))
        .in("m"),
      distanceFromStartKM: distFrom(toLatLong(this.state.start))
        .to(toLatLong(geoData))
        .in("km"),
      distanceFromStartIN: distFrom(toLatLong(this.state.start))
        .to(toLatLong(geoData))
        .in("in"),
      distanceFromStartFT: distFrom(toLatLong(this.state.start))
        .to(toLatLong(geoData))
        .in("ft"),
      distanceFromStartYD: distFrom(toLatLong(this.state.start))
        .to(toLatLong(geoData))
        .in("yd"),
      distanceFromStartMI: distFrom(toLatLong(this.state.start))
        .to(toLatLong(geoData))
        .in("mi"),
    });
  };

  render() {
    return (
      <Container>
        <Row>
          <Col>
            <p>
              Starting at: {this.state.start && toLatLong(this.state.start)}
            </p>
            <p>Starting on: {this.state.start && toTime(this.state.start)}</p>

            <p>Distance from start</p>
            <p>cm: {this.state.distanceFromStartCM}</p>
            <p>m: {this.state.distanceFromStartM}</p>
            <p>km: {this.state.distanceFromStartKM}</p>
            <p>in: {this.state.distanceFromStartIN}</p>
            <p>ft: {this.state.distanceFromStartFT}</p>
            <p>yd: {this.state.distanceFromStartYD}</p>
            <p>mi: {this.state.distanceFromStartMI}</p>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
