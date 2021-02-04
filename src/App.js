import React from "react";
import { Container, Row, Col } from "reactstrap";

import {
  toLatLong,
  startPoll,
  killPoll,
  getStartingPoint,
  cloneGeoData,
} from "./services/Geo";
import cityWorker from "workerize-loader!./workers/cities"; // eslint-disable-line import/no-webpack-loader-syntax
import measureWorker from "workerize-loader!./workers/measurements"; // eslint-disable-line import/no-webpack-loader-syntax

import DisplayData from "./components/DisplayData/DisplayData";
import Map from "./components/Map/Map";

const CityWorker = cityWorker();
const MeasurementWorker = measureWorker();

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      geoData: {
        coords: {},
      },
      farthestGeoDataFromStart: null,
      hasLocation: false,
      start: false,
      distanceFromStartCM: 0,
      prevGeoData: {},
      distanceTraveledInCM: 0,
      totalDistanceTraveledInCM: 0,
      startingLocation: {},
    };

    this.poll = null;
    this.map = null;
  }

  componentDidMount() {
    this.poll = startPoll(this.success);
    getStartingPoint(this.setStart);
    this.cityPoll = setInterval(
      () => this.getCurrentCity(cloneGeoData(this.state.geoData)),
      12000
    );
  }

  componentWillUnmount() {
    killPoll(this.poll);
    clearInterval(this.cityPoll);
  }

  setStart = (data) => {
    const latLong = toLatLong(data);
    this.setState({ start: data, geoData: data }, () => {
      this.getCurrentCity(cloneGeoData(data));
    });
  };

  getCurrentCity = (latLong) => {
    CityWorker.getEntryByLatLong(latLong).then((value) => {
      if (value.length !== 0) {
        this.setState({ startingLocation: value[0] });
      } else {
        this.setState({
          failedAtCity: true,
          startingLocation: {
            name: "Could not find city",
            country: "Could not find country",
          },
        });
      }
    });
  };

  success = (geoData) => {
    let _tempFarthestGeoData = null;
    let _farthestGeoData = null;
    let _distFromStart = null;
    let _distTraveled = null;

    MeasurementWorker.distBetweenInCM(
      cloneGeoData(this.state.start),
      cloneGeoData(geoData)
    ).then((value) => {
      _distFromStart = value;
    });
    MeasurementWorker.distBetweenInCM(
      cloneGeoData(geoData),
      cloneGeoData(this.state.geoData)
    ).then((value) => {
      _distTraveled = value;
    });

    if (this.state.farthestGeoDataFromStart) {
      MeasurementWorker.distBetweenInCM(
        cloneGeoData(this.state.farthestGeoDataFromStart),
        cloneGeoData(this.state.start)
      ).then((value) => {
        _tempFarthestGeoData = value;
      });
      if (_distFromStart > _tempFarthestGeoData) {
        _farthestGeoData = geoData;
      }
    } else {
      _farthestGeoData = geoData;
    }

    this.setState({
      farthestGeoDataFromStart: _farthestGeoData,
      geoData,
      distanceFromStartCM: _distFromStart,
      distanceTraveledInCM: _distTraveled,
      totalDistanceTraveledInCM:
        this.state.totalDistanceTraveledInCM + _distTraveled,
    });
  };

  render() {
    return (
      <Container>
        <Row>
          <Col xs={12} sm={6}>
            <DisplayData {...this.state} />
          </Col>
          <Col xs={12} sm={6}>
            <Map geoData={this.state.geoData} />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
