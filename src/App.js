import React from "react";
import { Container, Row, Col, UncontrolledCollapse } from "reactstrap";

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
    this.calculateFarthestGeo(geoData);
    this.calculatePointToPointFromStart(geoData);
    this.calculateTotalDistanceTraveledInCM(geoData);

    this.setState({
      geoData,
    });
  };

  calculatePointToPointFromStart = (_geoData) => {
    let _distFromStart = null;

    MeasurementWorker.distBetweenInCM(
      cloneGeoData(this.state.start),
      cloneGeoData(_geoData)
    ).then((value) => {
      _distFromStart = value;
      this.setState({
        distanceFromStartCM: _distFromStart,
      });
    });
  };

  calculateTotalDistanceTraveledInCM = (_geoData) => {
    let _distTraveled = null;

    MeasurementWorker.distBetweenInCM(
      cloneGeoData(_geoData),
      cloneGeoData(this.state.geoData)
    ).then((value) => {
      _distTraveled = value;
      this.setState({
        distanceTraveledInCM: _distTraveled,
        totalDistanceTraveledInCM:
          this.state.totalDistanceTraveledInCM + _distTraveled,
      });
    });
  };

  calculateFarthestGeo = (_geoData) => {
    let _farthestGeoData = null;

    if (this.state.farthestGeoDataFromStart) {
      MeasurementWorker.distBetweenInCM(
        cloneGeoData(this.state.farthestGeoDataFromStart),
        cloneGeoData(this.state.start)
      ).then((value1) => {
        MeasurementWorker.distBetweenInCM(
          cloneGeoData(_geoData),
          cloneGeoData(this.state.farthestGeoDataFromStart)
        ).then((value2) => {
          if (value2 > value1) {
            _farthestGeoData = _geoData;
            this.setState({ farthestGeoDataFromStart: _farthestGeoData });
          }
        });
      });
    } else {
      _farthestGeoData = _geoData;
      this.setState({ farthestGeoDataFromStart: _farthestGeoData });
    }
  };

  render() {
    return (
      <Container>
        <Row>
          <Col xs={12}>
            <a href="#data" id="dataToggler">
              Data
            </a>
            <UncontrolledCollapse id="data" toggler="#dataToggler">
              <DisplayData {...this.state} />
            </UncontrolledCollapse>
          </Col>
          <Col xs={12}>
            <Map geoData={this.state.geoData} />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
