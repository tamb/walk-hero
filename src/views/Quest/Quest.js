import React from "react";
import PropTypes from "prop-types";
import { Row, Col } from "reactstrap";
import { connect } from "substate-connect";

import store, { EVENTS } from "@store/store";
import { CUSTOMEVENTS } from "@utils/enums";
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
import Lockscreen from "@components/Lockscreen/Lockscreen";
import Map from "@components/Map/Map";
import ModalViewOne from "@modals/ModalViewOne/ModalViewOne";
import Scorecard from "@components/Scorecard/Scorecard";

const WiredBottomNav = connect(store, {
  paused: "play_state.paused",
  hasLocation: "play_state.has_location",
})(BottomNav);

const WiredLockscreen = connect(store, {
  unlockValue: "play_state.unlock_value",
})(Lockscreen);

const WiredMap = connect(store, {
  geoData: "quest.geodata",
  paused: "play_state.paused",
  hasLocation: "play_state.has_location",
})(Map);

const WiredScoreCard = connect(store, {
  journeyTime: "quest.journey_time",
  traveled: "quest.total_distance_traveled_cm",
})(Scorecard);

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
    store.on(EVENTS.PAUSED, this.killPolls); // pause response
    store.on(EVENTS.UNPAUSED, this.startPolls); // pause response
    store.on(EVENTS.STARTWALK, this.startPolls);
  }

  componentWillUnmount() {
    this.killPolls();
    window.removeEventListener(
      CUSTOMEVENTS.DATA_MODAL_TOGGLE,
      this.dataModalToggle
    );
    store.off(EVENTS.PAUSED, this.killPolls); // pause response
    store.off(EVENTS.UNPAUSED, this.startPolls); // pause response
    store.off(EVENTS.STARTWALK, this.startPolls);

  }

  // Logic

  calculateFarthestGeo = (_geoData) => {
    let _farthestGeoData = null;

    if (this.props.farthestGeoDataFromStart) {
      MeasurementWorker.distBetweenInCM(
        cloneGeoData(this.props.geo.farthestGeoDataFromStart),
        cloneGeoData(this.props.geo.start)
      ).then((value1) => {
        MeasurementWorker.distBetweenInCM(
          cloneGeoData(_geoData),
          cloneGeoData(this.props.geo.farthestGeoDataFromStart)
        ).then((value2) => {
          if (value2 > value1) {
            _farthestGeoData = _geoData;
            // this.setState({ farthestGeoDataFromStart: _farthestGeoData });
            store.emit("UPDATE_STATE", {
              "geo.farthestGeoDataFromStart": _farthestGeoData,
            });
          }
        });
      });
    } else {
      _farthestGeoData = _geoData;
      // this.setState({ farthestGeoDataFromStart: _farthestGeoData });
      store.emit("UPDATE_STATE", {
        "geo.farthestGeoDataFromStart": _farthestGeoData,
      });
    }
  };

  calculatePointToPointFromStart = (_geoData) => {
    let _distFromStart = null;

    MeasurementWorker.distBetweenInCM(
      cloneGeoData(this.props.geo.start),
      cloneGeoData(_geoData)
    ).then((value) => {
      _distFromStart = value;
      // this.setState({
      //   distanceFromStartCM: _distFromStart,
      // });
      store.emit("UPDATE_STATE", {
        "geo.distanceFromStart": _distFromStart,
      });
    });
  };

  calculateTotalDistanceTraveledInCM = (_geoData) => {
    let _distTraveled = null;

    MeasurementWorker.distBetweenInCM(
      cloneGeoData(_geoData),
      cloneGeoData(this.props.geo.geoData)
    ).then((value) => {
      _distTraveled = value;
      if (_distTraveled >= 35) {
        this.setState({
          totalDistanceTraveledInCM:
            this.props.geo.totalDistanceTraveledInCM + _distTraveled,
        });
      }
      this.setState({
        distanceTraveledInCM: _distTraveled,
      });
    });
  };

  confirmEndWalk = () => {
    this.killPolls();
    // this.setState(initialGameState);
    getStartingPoint(this.setStart);
  };

  getCurrentCity = (latLong) => {
    CityWorker.getEntryByLatLong(latLong).then((value) => {
      if (value.length !== 0) {
        const clonedCities = [...this.props.citiesVisited, value[0]];
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
          "geo.startingLocation": value[0],
          "geo.currentCity": value[0],
          "geo.citiesVisited": newCitiesVisited,
        });
      } else {
        this.setState({
          "geo.failedAtCity": true,
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
      journeyTime: this.props.journeyTime + 1,
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

  releaseWakeLock = () => {
    if (this.props.WakeLockSentinel) {
      console.log("releasing...");
      this.props.WakeLockSentinel.release().then(() => {
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
        locationPings: this.props.locationPings + 1,
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
          if (this.props.isUnlocked) {
            this.releaseWakeLock();
          }
          if (this.props.unlockValue < 100) {
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

  startPolls = () => {
    this.poll = startPoll(this.success);
    this.cityPoll = setInterval(
      () => this.getCurrentCity(cloneGeoData(this.props.geoData)),
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
      locationPings: this.props.locationPings + 1,
    });
  };

  // Render Methods
  render() {
    return (
      <React.Fragment>
        {!this.props.gameState.isUnlocked && (
          <WiredLockscreen setUnlockValue={this.setUnlockValue} />
        )}
        <WiredScoreCard />
        <Row>
          <Col xs={12}>
            {this.props.gameState.hasLocation && (
              <WiredMap currentLatLong={toLatLong(this.props.geoData)} />
            )}
          </Col>
        </Row>
        <WiredBottomNav togglePaused={this.togglePaused} />
        <ModalViewOne />
      </React.Fragment>
    );
  }
}

Quest.propTypes = {
  geo: PropTypes.object,
  gameState: PropTypes.object,
  modals: PropTypes.object,
};

export default connect(store, {
  geoData: "quest.geodata",
  gameState: "play_state",
})(Quest);
