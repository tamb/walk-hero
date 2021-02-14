import React from "react";
import { Container } from "reactstrap";
import { Provide } from "substate-connect";

import store from "@store/store";
import {VIEWS} from "@utils/enums";
import FullPageSpinner from "@components/FullPageSpinner/FullPageSpinner";
import Landing from "@views/Landing/Landing";

const Quest = React.lazy(() => import("@views/Quest/Quest"));


window.WHGlobals = {
  vibrationsOn: true,
};

const initialGameState = {
  view: VIEWS.LANDING,
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialGameState;
  }

  // VIEW switching
  goQuest = () => {
    this.setState({ view: VIEWS.QUEST });
  };

  goMinigames = () => {
    this.setState({ view: VIEWS.MINIGAMES });
  };

  goLanding = () => {
    this.setState({ view: VIEWS.LANDING });
  };

  // Logic

  // Render Methods
  render() {
    return (
      <Container fluid>
        {this.state.view === VIEWS.QUEST && (
          <React.Suspense fallback={<FullPageSpinner />}>
            <Quest
              appMethods={{
                goLanding: this.goLanding,
              }}
            />
          </React.Suspense>
        )}
        {this.state.view === VIEWS.LANDING && (
          <Landing
            isOpen={this.state.view === VIEWS.LANDING}
            goQuest={this.goQuest}
            goMinigames={this.goMinigames}
          />
        )}
      </Container>
    );
  }
}

const WiredApp = Provide(store, ["STATE_UPDATED"], null)(App);

export default WiredApp;
