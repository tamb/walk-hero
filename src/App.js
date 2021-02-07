import React from "react";
import { Container, Row, Col } from "reactstrap";

import { CUSTOMEVENTS } from "./enums";
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
import BottomNav from "./components/BottomNav/BottomNav";
import Scorecard from "./components/Scorecard/Scorecard";
import WarningModal from "./components/WarningModal/WarningModal";
import InstructionModal from "./components/InstructionModal/InstructionModal";

const CityWorker = cityWorker();
const MeasurementWorker = measureWorker();

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      warningModalOpen: true,
      instructionsModalOpen: false,
      journeyTime: 0,
      dataModalOpen: false,
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
    this.journeyTimePoll = null;
  }

  componentDidMount() {
    this.poll = startPoll(this.success);
    getStartingPoint(this.setStart);
    this.cityPoll = setInterval(
      () => this.getCurrentCity(cloneGeoData(this.state.geoData)),
      12000
    );
    window.addEventListener(
      CUSTOMEVENTS.DATA_MODAL_TOGGLE,
      this.dataModalToggle
    );
  }

  componentWillUnmount() {
    killPoll(this.poll);
    clearInterval(this.cityPoll);
    clearInterval(this.journeyTimePoll);
    window.removeEventListener(
      CUSTOMEVENTS.DATA_MODAL_TOGGLE,
      this.dataModalToggle
    );
  }

  journeyTimeTick = () => {
    this.setState({
      journeyTime: this.state.journeyTime + 1,
    });
  };

  dataModalToggle = () => {
    this.setState({
      dataModalOpen: !this.state.dataModalOpen,
    });
  };

  setStart = (data) => {
    this.setState({ start: data, geoData: data, hasLocation: true }, () => {
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
      if (_distTraveled >= 500) {
        this.setState({
          totalDistanceTraveledInCM:
            this.state.totalDistanceTraveledInCM + _distTraveled,
        });
      }
      this.setState({
        distanceTraveledInCM: _distTraveled,
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

  acceptWarning = () => {
    this.setState({ warningModalOpen: false, instructionsModalOpen: true });
  };

  readInstructions = () => {
    this.setState({ instructionsRead: true, instructionsModalOpen: false });
    this.journeyTimePoll = setInterval(this.journeyTimeTick, 1000);
  };

  render() {
    return (
      <Container fluid>
        <Scorecard
          journeyTime={this.state.journeyTime}
          traveled={this.state.totalDistanceTraveledInCM}
        />
        <Row>
          <DisplayData
            {...this.state}
            modalProps={{
              isOpen: this.state.dataModalOpen,
              toggle: this.dataModalToggle,
            }}
          />
          <Col xs={12}>
            <Map
              geoData={this.state.geoData}
              hasLocation={this.state.hasLocation}
              currentLatLong={toLatLong(this.state.geoData)}
            />
          </Col>
        </Row>
        <BottomNav hasLocation={this.state.hasLocation} />
        <WarningModal
          toggle={this.acceptWarning}
          isOpen={this.state.warningModalOpen}
        />
        <InstructionModal
          toggle={this.readInstructions}
          isOpen={this.state.instructionsModalOpen}
        />
      </Container>
    );
  }
}

export default App;
