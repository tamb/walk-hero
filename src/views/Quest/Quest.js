import React from "react";
import PropTypes from "prop-types";
import { Row, Col } from "reactstrap";
import { connect } from "substate-connect/dist/react";

import store, { STORE_EVENT } from "../../store/store";
import {
  startPoll,
  killPoll,
  getStartingPoint,
  cloneGeoData,
} from "../../services/Geo";
import cityWorker from "workerize-loader!./../../workers/cities"; // eslint-disable-line import/no-webpack-loader-syntax
import measureWorker from "workerize-loader!./../../workers/measurements"; // eslint-disable-line import/no-webpack-loader-syntax

import BottomNav from "../../components/BottomNav/BottomNav";
import Lockscreen from "../../components/Lockscreen/Lockscreen";
import Map from "../../components/Map/Map";
import ModalViewOne from "../../modals/ModalViewOne/ModalViewOne";
import Scorecard from "../../components/Scorecard/Scorecard";
import SideMenu from "../../components/SideMenu/SideMenu";

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
  quest: "quest",
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
    store.on(STORE_EVENT.PAUSED, this.killPolls); // pause response
    store.on(STORE_EVENT.UNPAUSED, this.startPolls); // pause response
    store.on(STORE_EVENT.START_WALK, this.startPolls);
    store.on(STORE_EVENT.REQUEST_WAKELOCK, this.requestWakeLock);
    store.on("LOCKSCREEN_SLIDER", this.setUnlockValue);
  }

  componentWillUnmount() {
    this.killPolls();
    store.off(STORE_EVENT.PAUSED, this.killPolls); // pause response
    store.off(STORE_EVENT.UNPAUSED, this.startPolls); // pause response
    store.off(STORE_EVENT.START_WALK, this.startPolls);
    store.off(STORE_EVENT.REQUEST_WAKELOCK, this.requestWakeLock);
    store.off("LOCKSCREEN_SLIDER", this.setUnlockValue);
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
      store.emit("UPDATE_STATE", {
        "quest.farthest_geodata_from_origin": _farthestGeoData,
      });
    }
  };

  // TODO: origin geodata is incorrect and being set as city
  // FIXME: origin_geodata should be geolocation object
  calculatePointToPointFromStart = (_geoData) => {
    let _distFromStart = null;

    MeasurementWorker.distBetweenInCM(
      cloneGeoData(this.props.questData.origin_geodata),
      cloneGeoData(_geoData)
    ).then((value) => {
      _distFromStart = value;
      store.emit("UPDATE_STATE", {
        "quest.distance.p2p_from_origin_cm": _distFromStart,
      });
    });
  };

  calculateTotalDistanceTraveledInCM = (_geoData) => {
    let _distTraveled = null;

    MeasurementWorker.distBetweenInCM(
      cloneGeoData(_geoData),
      cloneGeoData(this.props.questData.geodata)
    ).then((value) => {
      _distTraveled = value;
      if (_distTraveled >= 35) {
        store.emit(STORE_EVENT.UPDATE_STATE, {
          "quest.total_distance_traveled_cm":
            this.props.questData.geodata.totalDistanceTraveledInCM +
            _distTraveled,
        });
      }
      store.emit(STORE_EVENT.UPDATE_STATE, {
        "quest.distance_traveled_cm": _distTraveled,
      });
    });
  };

  confirmEndWalk = () => {
    this.killPolls();
    getStartingPoint(this.setStart);
  };

  getCurrentCity = (geoData) => {
    console.log(geoData);
    CityWorker.getCityByGeoData(geoData).then((value) => {
      if (value.length !== 0) {
        const clonedCities = [...this.props.questData.cities_visited, value[0]];
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
        store.emit(STORE_EVENT.UPDATE_STATE, {
          "quest.origin_geodata": value[0],
          "quest.current_city": value[0],
          "quest.cities_visited": newCitiesVisited,
        });
      } else {
        // failed to get city
      }
    });
  };

  journeyTimeTick = () => {
    store.emit(STORE_EVENT.UPDATE_STATE, {
      "quest.journey_time_s": store.getProp("quest.journey_time_s") + 1,
    });
  };

  killPolls = () => {
    killPoll(this.poll);
    clearInterval(this.cityPoll);
    clearInterval(this.journeyTimePoll);
  };

  setStart = (data) => {
    console.log("[GeoLocation Success - ", data);
    store.emit(STORE_EVENT.UPDATE_STATE, {
      "play_state.has_location": true,
      "quest.geodata": data,
      "quest.origin_geodata": data,
      "quest.location_pings": 0,
    });
    this.getCurrentCity(cloneGeoData(data));
  };

  startPolls = () => {
    this.poll = startPoll(this.success);
    this.cityPoll = setInterval(
      () => this.getCurrentCity(cloneGeoData(this.props.questData.geodata)),
      12000
    );
    this.journeyTimePoll = setInterval(this.journeyTimeTick, 1000);
  };

  success = (geoData) => {
    this.calculateFarthestGeo(geoData);
    this.calculatePointToPointFromStart(geoData);
    this.calculateTotalDistanceTraveledInCM(geoData);

    store.emit(STORE_EVENT.UPDATE_STATE, {
      "quest.geodata": cloneGeoData(geoData),
      "quest.location_pings": this.props.locationPings + 1,
    });
  };

  // wakelock
  releaseWakeLock = () => {
    if (this.WakeLockSentinel) {
      console.log("releasing...");
      this.WakeLockSentinel.release().then(() => {
        console.info("[WakeLock]: OFF");
        this.WakeLockSentinel = null;
      });
    }
  };

  requestWakeLock = async () => {
    if ("wakeLock" in navigator) {
      try {
        this.WakeLockSentinel = await navigator.wakeLock.request("screen");
        console.info("[WakeLock]: ON");
        store.emit(STORE_EVENT.UPDATE_STATE, {
          "play_state.is_unlocked": false,
        });
      } catch (err) {
        // The wake lock request fails - usually system-related, such as low battery.
        console.info(`${err.name}, ${err.message}`);
        this.WakeLockSentinel = null;
        store.emit(STORE_EVENT.UPDATE_STATE, {
          "play_state.is_unlocked": true,
        });
      }
    } else {
      console.info("no WakeLock");
      store.emit(STORE_EVENT.UPDATE_STATE, {
        "play_state.is_unlocked": true,
      });
    }
  };

  setUnlockValue(e) {
    const value = parseInt(e.target.value);
    store.emit(STORE_EVENT.UPDATE_STATE, {
      "play_state.unlock_value": value === 100 ? 0 : value,
      "play_state.is_unlocked": value === 100,
    });

    if (store.getProp("play_state.is_unlocked")) {
      this.releaseWakeLock();
    }

    setTimeout(() => {
      if (store.getProp("play_state.unlock_value") < 100) {
        store.emit(STORE_EVENT.UPDATE_STATE, {
          "play_state.unlock_value": 0,
        });
      }
    }, 700);
  }

  // Render Methods
  // TODO: remove ModalViewOne
  render() {
    return (
      <React.Fragment>
        {!this.props.playState.is_unlocked && <WiredLockscreen />}
        <WiredScoreCard />
        <WiredSideMenu />
        <Row>
          <Col xs={12}>{this.props.playState.has_location && <WiredMap />}</Col>
        </Row>
        <WiredBottomNav togglePaused={this.togglePaused} />
        <ModalViewOne />
      </React.Fragment>
    );
  }
}

Quest.propTypes = {
  // ancillarieState: PropTypes.object,
  playState: PropTypes.object,
  questData: PropTypes.object,
};

export default connect(store, {
  // ancillarieState: "ancillaries",
  playState: "play_state",
  questData: "quest",
})(Quest);
