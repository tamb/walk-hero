import React from "react";
import { Row, Col } from "reactstrap";
import {connect} from "substate-connect";

import store from "@store/store";
import { CUSTOMEVENTS, VIEWS } from "@utils/enums";
import {
  toLatLong,
  startPoll,
  killPoll,
  getStartingPoint,
  cloneGeoData,
} from "@services/Geo";
import cityWorker from "workerize-loader!@workers/cities"; // eslint-disable-line import/no-webpack-loader-syntax
import measureWorker from "workerize-loader!@workers/measurements"; // eslint-disable-line import/no-webpack-loader-syntax

import BottomNav from "@components/BottomNav/BottomNav";
import ConfirmEndWalkModal from "@components/ConfirmEndWalkModal/ConfirmEndWalkModal";
import InstructionModal from "@components/InstructionModal/InstructionModal";
import Lockscreen from "@components/Lockscreen/Lockscreen";
import Map from "@components/Map/Map";
import PauseModal from "@components/PauseModal/PauseModal";
import Scorecard from "@components/Scorecard/Scorecard";
import SettingsModal from "@components/SettingsModal/SettingsModal";
import StartModal from "@components/StartModal/StartModal";
import WarningModal from "@components/WarningModal/WarningModal";

const WiredBottomNav = connect(store, {
  paused: 'gameState.paused',
  hasLocation: 'gameState.hasLocation',
})(BottomNav);

const WiredConfirmEndWalkModal = connect(store, {
  isOpen: 'modals.confirmEndWalkModalOpen'
})(ConfirmEndWalkModal);

const WiredInstructionModal = connect(store, {
  isOpen: 'modals.instructionsModalOpen',
})(InstructionModal);

const WiredLockscreen = connect(store, {
  unlockValue: 'gameState.unlockValue',
})(Lockscreen);

const WiredMap = connect(store, {
  geoData: 'geo.geoData',
  paused: 'gameState.paused',
  hasLocation: 'gameState.hasLocation',
})(Map);

const WiredPauseModal = connect(store, {
  isOpen: 'modals.pauseModalOpen',
})(PauseModal);

const WiredScoreCard = connect(store, {
  journeyTime: 'geo.journeyTime',
  traveled: 'geo.distanceTraveledInCM',
})(Scorecard);

const WiredSettingsModal = connect(store, {
  isOpen: 'modals.settingsModalOpen',
  vibrationsOn: 'gameState.vibrationsOn',
  // much more
})(SettingsModal);

const WiredStartModal = connect(store, {
  isOpen: 'modals.startModalOpen'
})(StartModal);

const WiredWarningModal = connect(store, {
  isOpen: 'modals.warningModalOpen',
})(WarningModal);

const CityWorker = cityWorker();
const MeasurementWorker = measureWorker();



class Quest extends React.Component {
  constructor(props) {
    super(props);

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
    // this.setState(initialGameState);
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
        const newCitiesVisited = clonedCities.filter((city) => {
          if (value[0].lat !== city.lat && value[0].lng !== city.lng) {
            return true;
          } else {
            return false;
          }
        });
        if (newCitiesVisited.length === 0) {
          newCitiesVisited.push(value[0]);
        }
        this.setState({
          startingLocation: value[0],
          currentCity: value[0],
          citiesVisited: newCitiesVisited,
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
    this.setWakeLock();
  };

  readInstructions = () => {
    this.setState({
      instructionsRead: true,
      instructionsModalOpen: false,
      startModalOpen: true,
    });
  };

  releaseWakeLock = () => {
    if (this.state.WakeLockSentinel) {
      console.log("releasing...");
      this.state.WakeLockSentinel.release().then(() => {
        console.info("[WakeLock]: OFF");
        this.setState({ WakeLockSentinel: null });
      });
    }
  };

  setStart = (data) => {
    this.setState(
      {
        start: data,
        geoData: data,
        hasLocation: true,
        locationPings: this.state.locationPings + 1,
      },
      () => {
        this.getCurrentCity(cloneGeoData(data));
      }
    );
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
          if (this.state.isUnlocked) {
            this.releaseWakeLock();
          }
          if (this.state.unlockValue < 100) {
            this.setState({ unlockValue: 0 });
          }
        }, 700);
      }
    );
  };

  setWakeLock = async () => {
    if ("wakeLock" in navigator) {
      try {
        const wakeLock = await navigator.wakeLock.request("screen");
        console.info("[WakeLock]: ON");
        this.setState({
          WakeLockSentinel: wakeLock,
        });
      } catch (err) {
        // The wake lock request fails - usually system-related, such as low battery.
        console.info(`${err.name}, ${err.message}`);
        this.setState({ WakeLockSentinel: null });
      }
    } else {
      console.info("no WakeLock");
    }
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
          <WiredLockscreen
            setUnlockValue={this.setUnlockValue}
          />
        )}
        <WiredScoreCard/>
        <Row>
          <WiredSettingsModal
            // {...this.state}
            modalProps={{
              // isOpen: this.state.dataModalOpen,
              toggle: this.dataModalToggle,
            }}
            // unlockValue={this.state.unlockValue}
            setUnlockValue={this.setUnlockValue}
            lockScreen={this.lockScreen}
          />
          <Col xs={12}>
            {this.state.hasLocation && (
              <WiredMap
                currentLatLong={toLatLong(this.props.geoData)}
              />
            )}
          </Col>
        </Row>

        <WiredWarningModal
          acceptWarning={this.acceptWarning}
          denyWarning={this.props.appMethods.goLanding}
        />
        <WiredInstructionModal
          toggle={this.readInstructions}
        />
        <WiredStartModal
          startNewWalk={this.startNewWalk}
          continueOldWalk={() => alert("comming soon...")}
        />
        <WiredPauseModal
          endWalk={this.endWalk}
          continueWalk={this.togglePaused}
        />
        <WiredConfirmEndWalkModal
          cancelEndWalk={this.cancelEndWalk}
          confirmEndWalk={this.confirmEndWalk}
        />
        <WiredBottomNav
          togglePaused={this.togglePaused}
        />
      </React.Fragment>
    );
  }
}

export default connect()(Quest);
