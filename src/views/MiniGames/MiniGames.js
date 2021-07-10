import React from "react";
import { connect } from "substate-connect";
import {
  useRouteMatch,
  Route,
  Link,
  useHistory,
  Switch,
} from "react-router-dom";
import { Row, Col } from "reactstrap";

import store from "@store/store";
import { PLAY_STATUS } from "@utils/enums";
import VibrateLink from "@components/VibrateLink/VibrateLink";
import VibrateButton from "@components/VibrateButton/VibrateButton";
import MiniGameEndModal from "@modals/MiniGameEndModal/MiniGameEndModal";

import "./MiniGames.scss";

const Hangman = React.lazy(() => import("@minigames/Hangman/Hangman"));
const SliderPrecision = React.lazy(() =>
  import("@minigames/SliderPrecision/SliderPrecision")
);
const Raid = React.lazy(() => import("@minigames/Raid/Raid"));

function MiniGames(props) {
  const { path, url } = useRouteMatch();
  const browserHistory = useHistory();

  function renderList() {
    return (
      <nav className="MiniGames__nav">
        <ul>
          <li>
            <VibrateLink color="info" href={`${url}/hangman`}>
              <span>Hangman</span>
              <span>🔡</span>
            </VibrateLink>
          </li>
          <li>
            <VibrateLink color="info" href={`${url}/targetpractice`}>
              <span>Target</span>
              <span>🎯</span>
              <span>Practice</span>
            </VibrateLink>
          </li>
          <li>
            <VibrateLink color="info" href={`${url}/raid`}>
              <span>Raid</span>
              <span>⚔️👹</span>
            </VibrateLink>
          </li>
        </ul>
      </nav>
    );
  }
  return (
    <React.Fragment>
      <Row className="MiniGames__top-nav">
        <Col xs={8}>
          <Link to="/">
            <h1>Walk Hero</h1>
          </Link>
          <p>Minigames</p>
        </Col>
        <Col xs={4} className="MiniGames__back-btn">
          <VibrateButton color="link" onClick={browserHistory.goBack}>
            🔙
          </VibrateButton>
        </Col>
      </Row>
      <Switch>
        <Route exact path={path}>
          {renderList()}
        </Route>

        <Route path={`${path}/hangman`}>
          <React.Suspense fallback={renderList()}>
            <Hangman mini_games={props.mini_games} />
          </React.Suspense>
        </Route>
        <Route path={`${path}/targetpractice`}>
          <React.Suspense fallback={renderList()}>
            <SliderPrecision />
          </React.Suspense>
        </Route>
        <Route path={`${path}/raid`}>
          <React.Suspense fallback={renderList()}>
            <Raid />
          </React.Suspense>
        </Route>
      </Switch>
      <Row>
        <Col className="MiniGames__stats">
          <span>💰 {props.mini_games.cash}</span>
          <span>💖 {props.mini_games.lives}</span>
          <span>📦 {props.mini_games.resources}</span>
          <span>⚙️</span>
        </Col>
      </Row>
      <MiniGameEndModal
        isOpen={
          props.mini_games.play_status === PLAY_STATUS.WON ||
          props.mini_games.play_status === PLAY_STATUS.LOST
        }
        won={props.mini_games.play_status === PLAY_STATUS.WON}
        msg={props.mini_games.msg}
      />
    </React.Fragment>
  );
}

export default connect(store, {
  mini_games: "mini_games",
})(MiniGames);
