import React from "react";
import PropTypes from "prop-types";
import { Container } from "reactstrap";
import { Provide, connect } from "substate-connect/dist/react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import store, { EVENTS } from "@store/store";
import { VIEWS } from "@utils/enums";
import FullPageSpinner from "@components/FullPageSpinner/FullPageSpinner";
import Landing from "@views/Landing/Landing";

import "./App.css";

const Quest = React.lazy(() => import("@views/Quest/Quest"));
const MiniGames = React.lazy(() => import("@views/MiniGames/MiniGames"));

console.log(store);
window.store = store;


class App extends React.Component {
  goLanding = () => {
    store.emit(EVENTS.UPDATE_STATE, { "play_state.view": VIEWS.LANDING });
  };

  // Logic

  // Render Methods
  render() {
    return (
      <BrowserRouter>
        <Container fluid id="app">
          <Switch>
            <Route path="/quest">
              <React.Suspense fallback={<FullPageSpinner />}>
                <Quest />
              </React.Suspense>
            </Route>
            <Route path="/minigames">
              <React.Suspense fallback={<FullPageSpinner />}>
                <MiniGames />
              </React.Suspense>
            </Route>
            <Route path="">
              <Landing
                isOpen={this.props.play_state.view === VIEWS.LANDING}
                goQuest={this.goQuest}
                goMinigames={this.goMinigames}
              />
            </Route>
          </Switch>
        </Container>
      </BrowserRouter>
    );
  }
}

App.propTypes = {
  play_state: PropTypes.object,
};

const ConnectedApp = connect(store, {
  play_state: "play_state",
})(App);

// WRITE_STATE_UPDATED will be the $type that is fired when we update state and want middleware to save to IDB
export default Provide(
  store,
  [
    EVENTS.STATE_UPDATED,
    EVENTS.WRITE_STATE_UPDATED,
    EVENTS.PAUSED,
    EVENTS.UNPAUSED,
    EVENTS.START_WALK,
  ],
  function () {
    console.log("I mounted", this, store.getCurrentState());
  }
)(ConnectedApp);
