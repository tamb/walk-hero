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

import BottomNav from "./components/BottomNav/BottomNav";
import DisplayData from "./components/DisplayData/DisplayData";
import InstructionModal from "./components/InstructionModal/InstructionModal";
import Lockscreen from "./components/Lockscreen/Lockscreen";
import Map from "./components/Map/Map";
import Scorecard from "./components/Scorecard/Scorecard";
import StartModal from "./components/StartModal/StartModal";
import WarningModal from "./components/WarningModal/WarningModal";

const CityWorker = cityWorker();
const MeasurementWorker = measureWorker();

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // game state
      hasLocation: false,
      isUnlocked: true,
      paused: false,
      start: false,
      unlockValue: 0,

      // geo state
      distanceFromStartCM: 0,
      distanceTraveledInCM: 0,
      farthestGeoDataFromStart: null,
      geoData: {
        coords: {},
      },
      journeyTime: 0,
      startingLocation: {},
      totalDistanceTraveledInCM: 0,
      citiesVisited: new Set(),
      currentCity: null,

      // modals
      dataModalOpen: false,
      instructionsModalOpen: false,
      startModalOpen: false,
      warningModalOpen: true,
    };

    this.journeyTimePoll = null;
    this.map = null;
    this.poll = null;
  }

  // Lifecycle Methods
  componentDidMount() {
    // todo when starting game, "unpause", render map before unpause so attribution is rendered correctly.
    getStartingPoint(this.setStart);
    window.addEventListener(
      CUSTOMEVENTS.DATA_MODAL_TOGGLE,
      this.dataModalToggle
    );
  }

  componentWillUnmount() {
    this.killPolls();
    window.removeEventListener(
      CUSTOMEVENTS.DATA_MODAL_TOGGLE,
      this.dataModalToggle
    );
  }

  // Logic
  acceptWarning = () => {
    this.setState({ warningModalOpen: false, instructionsModalOpen: true });
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
      if (_distTraveled >= 35) {
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

  dataModalToggle = () => {
    this.setState({
      dataModalOpen: !this.state.dataModalOpen,
    });
  };

  getCurrentCity = (latLong) => {
    CityWorker.getEntryByLatLong(latLong).then((value) => {
      if (value.length !== 0) {
        const citiesSet = new Set(this.state.citiesVisited);
        citiesSet.add(value[0]);
        this.setState({ startingLocation: value[0], currentCity: value[0], citiesVisited: citiesSet });
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

  journeyTimeTick = () => {
    this.setState({
      journeyTime: this.state.journeyTime + 1,
    });
  };

  killPolls = () => {
    killPoll(this.poll);
    clearInterval(this.cityPoll);
    clearInterval(this.journeyTimePoll);
  };

  lockScreen = () => {
    this.setState({ isUnlocked: false });
  };

  readInstructions = () => {
    this.setState({
      instructionsRead: true,
      instructionsModalOpen: false,
      startModalOpen: true,
    });
  };

  setStart = (data) => {
    this.setState({ start: data, geoData: data, hasLocation: true }, () => {
      this.getCurrentCity(cloneGeoData(data));
    });
  };

  setUnlockValue = (e) => {
    const value = parseInt(e.target.value);
    this.setState(
      {
        unlockValue: value === 100 ? 0 : value,
        isUnlocked: value === 100,
      },
      () => {
        setTimeout(() => {
          if (this.state.unlockValue < 100) {
            this.setState({ unlockValue: 0 });
          }
        }, 700);
      }
    );
  };

  startNewWalk = () => {
    this.setState({ startModalOpen: false });
    this.startPolls();
  };

  startPolls = () => {
    this.poll = startPoll(this.success);
    this.cityPoll = setInterval(
      () => this.getCurrentCity(cloneGeoData(this.state.geoData)),
      12000
    );
    this.journeyTimePoll = setInterval(this.journeyTimeTick, 1000);
  };

  success = (geoData) => {
    this.calculateFarthestGeo(geoData);
    this.calculatePointToPointFromStart(geoData);
    this.calculateTotalDistanceTraveledInCM(geoData);

    this.setState({
      geoData,
    });
  };

  togglePaused = () => {
    this.setState({ paused: !this.state.paused }, () => {
      if (this.state.paused) {
        this.killPolls();
      } else {
        this.startPolls();
      }
    });
  };

  // Render Methods
  render() {
    return (
      <Container fluid>
        {!this.state.isUnlocked && (
          <Lockscreen
            unlockValue={this.state.unlockValue}
            setUnlockValue={this.setUnlockValue}
          />
        )}
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
            unlockValue={this.state.unlockValue}
            setUnlockValue={this.setUnlockValue}
            lockScreen={this.lockScreen}
          />
          <Col xs={12}>
            <Map
              geoData={this.state.geoData}
              paused={this.state.paused}
              hasLocation={this.state.hasLocation}
              currentLatLong={toLatLong(this.state.geoData)}
            />
          </Col>
        </Row>
        <BottomNav
          paused={this.state.paused}
          togglePaused={this.togglePaused}
          hasLocation={this.state.hasLocation}
        />
        <WarningModal
          toggle={this.acceptWarning}
          isOpen={this.state.warningModalOpen}
        />
        <InstructionModal
          toggle={this.readInstructions}
          isOpen={this.state.instructionsModalOpen}
        />
        <StartModal
          startNewWalk={this.startNewWalk}
          continueOldWalk={() => alert("comming soon...")}
          isOpen={this.state.startModalOpen}
        />
      </Container>
    );
  }
}

export default App;
