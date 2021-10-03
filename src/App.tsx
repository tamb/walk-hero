import React from "react";
import { Container } from "reactstrap";
import { Provide, connect } from "substate-connect/dist/react";
import { HashRouter as BrowserRouter, Route, Switch } from "react-router-dom";

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
              <React.Suspense fallback={<Blank />}>
                <Landing />
              </React.Suspense>
            </Route>
          </Switch>
        </Container>
      </BrowserRouter>
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
  }
)(ConnectedApp);
