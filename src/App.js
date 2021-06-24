import React from "react";
import PropTypes from "prop-types";
import { Container } from "reactstrap";
import { Provide, connect } from "substate-connect/dist/react";

import store, { EVENTS } from "@store/store";
import { VIEWS } from "@utils/enums";
import FullPageSpinner from "@components/FullPageSpinner/FullPageSpinner";
import Landing from "@views/Landing/Landing";
import Hangman from "@minigames/Hangman/Hangman";

const Quest = React.lazy(() => import("@views/Quest/Quest"));

console.log(store);
window.store = store;
class App extends React.Component {
  // VIEW switching
  goQuest = () => {
    store.emit(EVENTS.UPDATE_STATE, { "play_state.view": VIEWS.QUEST });
  };

  goMinigames = () => {
    store.emit(EVENTS.UPDATE_STATE, { "play_state.view": VIEWS.MINIGAMES });
  };

  goLanding = () => {
    store.emit(EVENTS.UPDATE_STATE, { "play_state.view": VIEWS.LANDING });
  };

  // Logic

  // Render Methods
  render() {
    return (
      <Container fluid>
        <Hangman />
        {this.props.play_state.view === VIEWS.QUEST && (
          <React.Suspense fallback={<FullPageSpinner />}>
            <Quest
              appMethods={{
                goLanding: this.goLanding,
              }}
            />
          </React.Suspense>
        )}
        {this.props.play_state.view === VIEWS.LANDING && (
          <Landing
            isOpen={this.props.play_state.view === VIEWS.LANDING}
            goQuest={this.goQuest}
            goMinigames={this.goMinigames}
          />
        )}
      </Container>
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
