import React from "react";
import distFrom from "distance-from";
import { Container, Row, Col } from "reactstrap";

import { toLatLong, toTime } from "./services/Geo";
import cityWorker from "workerize-loader!./workers/cities"; // eslint-disable-line import/no-webpack-loader-syntax

const CityWorker = cityWorker();

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      geoData: {},
      farthestGeoDataFromStart: null,
      hasLocation: false,
      start: false,
      distanceFromStartCM: 0,
      prevGeoData: {},
      distanceTraveledInCM: 0,
      totalDistanceTraveledInCM: 0,
      startingLocation: {},
    };
  }

  componentDidMount() {
    this.poll = navigator.geolocation.watchPosition(this.success, null, {
      enableHighAccuracy: true,
      timeout: 1000,
    });
    navigator.geolocation.getCurrentPosition(this.setStart);
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.poll);
  }

  setStart = (data) => {
    const latLong = toLatLong(data);
    this.setState({ start: data, geoData: data }, () => {
      CityWorker.getEntryByLatLong(latLong).then((value) => {
        console.log(value);
        // console.log(parseFloat(value[2].lng));
        // console.log(latLong[1]);
        // console.log(parseFloat(value[2].lng) - latLong[1])
        // console.log(toLatLong(this.state.geoData)[0].toFixed(5));
        // console.log(value[2].lat - toLatLong(this.state.geoData)[0].toFixed(5));
        // console.log(toLatLong(this.state.geoData));
        // console.log((toLatLong(this.state.geoData)[0] + Number(value[0])))
        this.setState({ startingLocation: value[0] });
      });
    });
  };

  success = (geoData) => {
    let farthestGeoData = this.state.farthestGeoDataFromStart;
    const distanceTraveled = distFrom(toLatLong(geoData))
      .to(toLatLong(this.state.geoData))
      .in("cm");

    const distFromStart = distFrom(toLatLong(this.state.start))
      .to(toLatLong(geoData))
      .in("cm");
    if (this.state.farthestGeoDataFromStart) {
      if (
        distFromStart >
        distFrom(toLatLong(this.state.farthestGeoDataFromStart))
          .to(toLatLong(this.state.start))
          .in("cm")
      ) {
        farthestGeoData = geoData;
      }
    } else {
      farthestGeoData = geoData;
    }
    this.setState({
      farthestGeoDataFromStart: farthestGeoData,
      geoData,
      distanceFromStartCM: distFrom(toLatLong(this.state.start))
        .to(toLatLong(geoData))
        .in("cm"),
      distanceTraveledInCM: distanceTraveled,
      totalDistanceTraveledInCM:
        this.state.totalDistanceTraveledInCM + distanceTraveled,
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
            <p>
              Distance JUST Traveled in CM: {this.state.distanceTraveledInCM}
            </p>
            <p>
              TOTAL Distance Traveled in CM:{" "}
              {this.state.totalDistanceTraveledInCM}
            </p>
            <p>Starting location</p>
            <p>City: {this.state.startingLocation.name}</p>
            <p>Country: {this.state.startingLocation.country}</p>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
