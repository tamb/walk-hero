import React from "react";
import PropTypes from "prop-types";
import { Row, Col } from "reactstrap";
import { connect } from "substate-connect";

import store, { EVENTS } from "@store/store";
import { CUSTOMEVENTS } from "@utils/enums";
import {
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
import SideMenu from "@components/SideMenu/SideMenu";

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
  journeyTime: "quest.journey_time_s",
  traveled: "quest.total_distance_traveled_cm",
})(Scorecard);

const WiredSideMenu = connect(store, {
  vibrationsOn: "game_settings.game_vibrations",
  hapticOn: "game_settings.haptic_feedback",
  open: "ancillaries.side_menu_open",
})(SideMenu);

const CityWorker = cityWorker();
const MeasurementWorker = measureWorker();

class Quest extends React.Component {
  constructor(props) {
    super(props);

    this.journeyTimePoll = null;
    this.map = null;
    this.poll = null;
    this.WakeLockSentinel = null; // TODO refactor to use this sentinel
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
            store.emit("UPDATE_STATE", {
              "quest.farthest_geodata_from_origin": _farthestGeoData,
            });
          }
        });
      });
    } else {
      _farthestGeoData = _geoData;
      // this.setState({ farthestGeoDataFromStart: _farthestGeoData });
      store.emit("UPDATE_STATE", {
        "quest.farthest_geodata_from_origin": _farthestGeoData,
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
        "quest.distance.p2p_from_origin_cm": _distFromStart,
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
        store.emit(EVENTS.UPDATE_STATE, {
          "quest.total_distance_traveled_cm":
            this.props.geo.totalDistanceTraveledInCM + _distTraveled,
        });
      }
      this.setState({
        distanceTraveledInCM: _distTraveled,
      });
      store.emit(EVENTS.UPDATE_STATE, {
        "quest.distance_traveled_cm": _distTraveled,
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
        const clonedCities = [...this.props.quest.cities_visited, value[0]];
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
        store.emit(EVENTS.UPDATE_STATE, {
          "quest.origin_geodata": value[0],
          "quest.current_city": value[0],
          "quest.cities_visited": newCitiesVisited,
        });

        // this.setState({
        //   "geo.starting_location": value[0],
        //   "geo.current_city": value[0],
        //   "geo.cities_visited": newCitiesVisited,
        // });
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
    store.emit(EVENTS.UPDATE_STATE, {
      "quest.journey_time_s": store.getProp("quest.journey_time_s") + 1,
    });
  };

  killPolls = () => {
    killPoll(this.poll);
    clearInterval(this.cityPoll);
    clearInterval(this.journeyTimePoll);
  };

  setStart = (data) => {
    store.emit(EVENTS.UPDATE_STATE, {
      "play_state.has_location": true,
      "quest.geodata": data,
      "quest.origin_geodata": data,
      "quest.location_pings": 0,
    });
    this.getCurrentCity(cloneGeoData(data));

    // this.setState(
    //   {
    //     start: data,
    //     geoData: data,
    //     hasLocation: true,
    //     locationPings: this.props.locationPings + 1,
    //   },
    //   () => {
    //     this.getCurrentCity(cloneGeoData(data));
    //   }
    // );
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

    // this.setState({
    //   geoData,
    //   locationPings: this.props.locationPings + 1,
    // });

    store.emit(EVENTS.UPDATE_STATE, {
      "quest.geodata": cloneGeoData(geoData),
      "quest.location_pings": this.props.locationPings + 1,
    });
  };

  // LOCKSCREEN
  lockScreen = () => {
    store.emit(EVENTS.UPDATE_STATE, {
      "play_state.is_unlocked": true,
    });
    this.setWakeLock();
  };

  releaseWakeLock = () => {
    if (this.WakeLockSentinel) {
      console.log("releasing...");
      this.WakeLockSentinel.release().then(() => {
        console.info("[WakeLock]: OFF");
        this.WakeLockSentinel = null;
      });
    }
  };

  setUnlockValue = (e) => {
    const value = parseInt(e.target.value);
    store.emit(EVENTS.UPDATE_STATE, {
      "play_state.unlock_value": value === 100 ? 0 : value,
      "play_state.is_unlocked": value === 100,
    });

    if (store.getProp("play_state.is_unlocked")) {
      this.releaseWakeLock();
    }

    setTimeout(() => {
      if (store.getProp("play_state.unlock_value") < 100) {
        store.emit(EVENTS.UPDATE_STATE, {
          "play_state.unlock_value": 0,
        });
      }
    }, 700);
  };

  setWakeLock = async () => {
    if ("wakeLock" in navigator) {
      try {
        this.WakeLockSentinel = await navigator.wakeLock.request("screen");
        console.info("[WakeLock]: ON");
      } catch (err) {
        // The wake lock request fails - usually system-related, such as low battery.
        console.info(`${err.name}, ${err.message}`);
        this.WakeLockSentinel = null;
      }
    } else {
      console.info("no WakeLock");
    }
  };

  // END LOCKSCREEN

  // Render Methods
  render() {
    return (
      <React.Fragment>
        {!this.props.gameState.is_unlocked && (
          <WiredLockscreen setUnlockValue={this.setUnlockValue} />
        )}
        <WiredScoreCard />
        <WiredSideMenu/>
        <Row>
          <Col xs={12}>
            {this.props.gameState.has_location && (
              <WiredMap/>
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
  quest: "quest",
})(Quest);
