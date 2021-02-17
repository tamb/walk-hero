import React from "react";
import PropTypes from "prop-types";
import { Container } from "reactstrap";
import { Provide, connect } from "substate-connect/dist/react";

import store from "@store/store";
import { VIEWS } from "@utils/enums";
import FullPageSpinner from "@components/FullPageSpinner/FullPageSpinner";
import Landing from "@views/Landing/Landing";

const Quest = React.lazy(() => import("@views/Quest/Quest"));

class App extends React.Component {
  // VIEW switching
  goQuest = () => {
    store.emit("UPDATE_STATE", { "gameState.view": VIEWS.QUEST });
  };

  goMinigames = () => {
    store.emit("UPDATE_STATE", { "gameState.view": VIEWS.MINIGAMES });
  };

  goLanding = () => {
    store.emit("UPDATE_STATE", { "gameState.view": VIEWS.LANDING });
  };

  // Logic

  // Render Methods
  render() {
    return (
      <Container fluid>
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
  ["STATE_UPDATED", "WRITE_STATE_UPDATED"],
  function () {
    console.log("I mounted", this, store.getCurrentState());
  }
)(ConnectedApp);
