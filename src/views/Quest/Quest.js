import React from "react";
import { Row, Col } from "reactstrap";

import { CUSTOMEVENTS } from "./../../enums";
import {
  toLatLong,
  startPoll,
  killPoll,
  getStartingPoint,
  cloneGeoData,
} from "./../../services/Geo";
import cityWorker from "workerize-loader!./../../workers/cities"; // eslint-disable-line import/no-webpack-loader-syntax
import measureWorker from "workerize-loader!./../../workers/measurements"; // eslint-disable-line import/no-webpack-loader-syntax

import BottomNav from "./../../components/BottomNav/BottomNav";
import ConfirmEndWalkModal from "./../../components/ConfirmEndWalkModal/ConfirmEndWalkModal";
import DisplayData from "./../../components/DisplayData/DisplayData";
import InstructionModal from "./../../components/InstructionModal/InstructionModal";
import Lockscreen from "./../../components/Lockscreen/Lockscreen";
import Map from "./../../components/Map/Map";
import PauseModal from "./../../components/PauseModal/PauseModal";
import Scorecard from "./../../components/Scorecard/Scorecard";
import StartModal from "./../../components/StartModal/StartModal";
import WarningModal from "./../../components/WarningModal/WarningModal";

const CityWorker = cityWorker();
const MeasurementWorker = measureWorker();

const VIEWS = {
  LANDING: "landing",
  QUEST: "quest",
  MINIGAMES: "minigames",
};

const initialGameState = {
  // game state
  hasLocation: false,
  isUnlocked: true,
  paused: false,
  start: false,
  unlockValue: 0,
  walkEnded: false,
  view: VIEWS.QUEST,

  // geo state
  // TODO: snag walk from indexeddb or create new walk and expose in spread operator
  distanceFromStartCM: 0,
  distanceTraveledInCM: 0,
  farthestGeoDataFromStart: null,
  geoData: {
    coords: {},
  },
  journeyTime: 0,
  startingLocation: {},
  totalDistanceTraveledInCM: 0,
  citiesVisited: [],
  currentCity: null,
  locationPings: 0,

  // modals
  confirmEndWalkModalOpen: false,
  dataModalOpen: false,
  instructionsModalOpen: false,
  pauseModalOpen: false,
  startModalOpen: false,
  warningModalOpen: true,
};

class Quest extends React.Component {
  constructor(props) {
    super(props);

    this.state = initialGameState;

    this.journeyTimePoll = null;
    this.map = null;
    this.poll = null;
  }

  // Lifecycle Methods
  componentDidMount() {
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

  // VIEW switching

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

  cancelEndWalk = () => {
    this.setState({
      endWalk: false,
      confirmEndWalkModalOpen: false,
      paused: true,
      pauseModalOpen: true,
    });
  };

  confirmEndWalk = () => {
    this.killPolls();
    this.setState(initialGameState);
    getStartingPoint(this.setStart);
  };

  dataModalToggle = () => {
    this.setState({
      dataModalOpen: !this.state.dataModalOpen,
    });
  };

  endWalk = () => {
    this.setState({
      confirmEndWalkModalOpen: true,
      pauseModalOpen: false,
    });
  };
  getCurrentCity = (latLong) => {
    CityWorker.getEntryByLatLong(latLong).then((value) => {
      if (value.length !== 0) {
        const clonedCities = [...this.state.citiesVisited, value[0]];
        const newCitiesVisited = clonedCities.filter(city => {
          if(value[0].lat !== city.lat && value[0].lng !== city.lng){
            return true;
          } else {
            return false;
          }
        });
        if(newCitiesVisited.length === 0){
          newCitiesVisited.push(value[0]);
        }
        this.setState({
          startingLocation: value[0],
          currentCity: value[0],
          citiesVisited: newCitiesVisited
        });
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
    this.setState({ start: data, geoData: data, hasLocation: true, locationPings: this.state.locationPings + 1 }, () => {
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
      locationPings: this.state.locationPings + 1,
    });
  };

  togglePaused = () => {
    this.setState({ paused: !this.state.paused }, () => {
      if (this.state.paused) {
        this.setState({ pauseModalOpen: true });
        this.killPolls();
      } else {
        this.setState({ pauseModalOpen: false });
        this.startPolls();
      }
    });
  };

  // Render Methods
  render() {
    return (
      <React.Fragment>
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
            {this.state.hasLocation && (
              <Map
                geoData={this.state.geoData}
                paused={this.state.paused}
                hasLocation={this.state.hasLocation}
                currentLatLong={toLatLong(this.state.geoData)}
              />
            )}
          </Col>
        </Row>

        <WarningModal
          acceptWarning={this.acceptWarning}
          denyWarning={this.props.appMethods.goLanding}
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
        <PauseModal
          isOpen={this.state.pauseModalOpen}
          endWalk={this.endWalk}
          continueWalk={this.togglePaused}
        />
        <ConfirmEndWalkModal
          isOpen={this.state.confirmEndWalkModalOpen}
          cancelEndWalk={this.cancelEndWalk}
          confirmEndWalk={this.confirmEndWalk}
        />
        <BottomNav
          paused={this.state.paused}
          togglePaused={this.togglePaused}
          hasLocation={this.state.hasLocation}
        />
      </React.Fragment>
    );
  }
}

export default Quest;
