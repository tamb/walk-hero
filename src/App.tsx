import React from "react";
import { Container } from "reactstrap";
import { HashRouter, Route, Routes } from "react-router-dom";
import { Provide, connect } from "./store/connect";

import store, { STORE_EVENT } from "./store/store";
import { VIEWS } from "./utils/enums";
import FullPageSpinner from "./components/FullPageSpinner/FullPageSpinner";

import "./App.css";

const Quest = React.lazy(() => import("./views/Quest/Quest"));
const MiniGames = React.lazy(() => import("./views/MiniGames/MiniGames"));
const Landing = React.lazy(() => import("./views/Landing/Landing"));
console.log(store);

function Blank() {
  return <div></div>;
}
class App extends React.Component {
  goLanding = () => {
    store.emit(STORE_EVENT.UPDATE_STATE, { "play_state.view": VIEWS.LANDING });
  };

  // Logic

  // Render Methods
  render() {
    return (
      <HashRouter>
        <Container fluid id="app">
          <Routes>
            <Route
              path="/quest"
              element={
                <React.Suspense fallback={<FullPageSpinner />}>
                  <Quest />
                </React.Suspense>
              }
            />
            <Route
              path="/minigames/*"
              element={
                <React.Suspense fallback={<FullPageSpinner />}>
                  <MiniGames />
                </React.Suspense>
              }
            />
            <Route
              path="*"
              element={
                <React.Suspense fallback={<Blank />}>
                  <Landing />
                </React.Suspense>
              }
            />
          </Routes>
        </Container>
      </HashRouter>
    );
  }
}

const ConnectedApp = connect(store, {
  play_state: "play_state",
})(App);

// WRITE_STATE_UPDATED will be the $type that is fired when we update state and want middleware to save to IDB
export default Provide(
  store,
  [
    STORE_EVENT.STATE_UPDATED,
    STORE_EVENT.WRITE_STATE_UPDATED,
    STORE_EVENT.PAUSED,
    STORE_EVENT.UNPAUSED,
    STORE_EVENT.START_WALK,
  ],
  function () {
    console.log("I mounted", store.getCurrentState());
  },
)(ConnectedApp);
