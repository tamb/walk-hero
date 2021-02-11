import React from "react";
import {Container} from "reactstrap";

import FullPageSpinner from "./components/FullPageSpinner/FullPageSpinner";
import Landing from "./views/Landing/Landing";
import BottomNav from "./components/BottomNav/BottomNav";

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
    this.setState({ view: VIEWS.QUEST });
  };

  goMinigames = () => {
    this.setState({ view: VIEWS.MINIGAMES });
  };

  // Logic

  // Render Methods
  render() {
    return (
      <Container fluid>
        {this.state.view === VIEWS.QUEST && (
          <React.Suspense fallback={<FullPageSpinner />}>
            <Quest />
          </React.Suspense>
        )}
        {this.state.view === VIEWS.LANDING && (
          <Landing
            isOpen={this.state.view === VIEWS.LANDING}
            goQuest={this.goQuest}
            goMinigames={this.goMinigames}
          />
        )}
        <BottomNav
          paused={this.state.paused}
          togglePaused={this.togglePaused}
          hasLocation={this.state.hasLocation}
        />
      </Container>
    );
  }
}

export default App;
