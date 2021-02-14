import React from "react";
import { Container } from "reactstrap";

import FullPageSpinner from "./components/FullPageSpinner/FullPageSpinner";
import Landing from "./views/Landing/Landing";

const Quest = React.lazy(() => import("./views/Quest/Quest"));
const VIEWS = {
  LANDING: "landing",
  QUEST: "quest",
  MINIGAMES: "minigames",
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
    window.navigator.vibrate(200);
    this.setState({ view: VIEWS.QUEST });
  };

  goMinigames = () => {
    window.navigator.vibrate(200);
    this.setState({ view: VIEWS.MINIGAMES });
  };

  goLanding = () => {
    window.navigator.vibrate(200);
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

export default App;
