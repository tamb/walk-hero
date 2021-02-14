import substate from "substate";

import { VIEWS } from "@utils/enums";

const store = new substate({
  name: "WalkHero",
  state: {
    gameState: {
      hasLocation: false,
      isUnlocked: true,
      paused: false,
      start: false,
      unlockValue: 0,
      walkEnded: false,
      vibrationsOn: true,
      view: VIEWS.LANDING,
      WakeLockSentinel: null,
    },
    modals: {
      confirmEndWalkModalOpen: false,
      settingsModalOpen: false,
      instructionsModalOpen: false,
      pauseModalOpen: false,
      startModalOpen: false,
      warningModalOpen: true,
    },

    geo: {
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
    },
  },
});

export default store;
