import React from "react";
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
    store.emit("UPDATE_STATE", { 'gameState.view': VIEWS.QUEST })
  };

  goMinigames = () => {
    store.emit("UPDATE_STATE", { 'gameState.view': VIEWS.MINIGAMES })
  };

  goLanding = () => {
    store.emit("UPDATE_STATE", { 'gameState.view': VIEWS.LANDING })
  };

  // Logic

  // Render Methods
  render() {
    return (
      <Container fluid>
        {this.props.gameState.view === VIEWS.QUEST && (
          <React.Suspense fallback={<FullPageSpinner />}>
            <Quest
              appMethods={{
                goLanding: this.goLanding,
              }}
            />
          </React.Suspense>
        )}
        {this.props.gameState.view === VIEWS.LANDING && (
          <Landing
            isOpen={this.props.gameState.view === VIEWS.LANDING}
            goQuest={this.goQuest}
            goMinigames={this.goMinigames}
          />
        )}
      </Container>
    );
  }
}
const ConnectedApp = connect(store, {
  gameState: 'gameState',
  geo: 'geo',
  modals: 'modals',

})(App);

export default Provide(store, ["STATE_UPDATED"], function () {
  console.log("I mounted", this, store.getCurrentState());
})(ConnectedApp);
