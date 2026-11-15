import React from "react";
import { connect } from "../../store/connect";
import { Route, Link, Routes, useNavigate } from "react-router-dom";
import { Row, Col } from "reactstrap";

import store from "../../store/store";
import { MINIGAME_STATUS } from "../../utils/enums";
import VibrateLink from "../../components/VibrateLink/VibrateLink";
import VibrateButton from "../../components/VibrateButton/VibrateButton";
import MiniGameEndModal from "../../modals/MiniGameEndModal/MiniGameEndModal";

import "./MiniGames.scss";

const Hangman = React.lazy(() => import("../../minigames/Hangman/Hangman"));
const SliderPrecision = React.lazy(() => import("../../minigames/SliderPrecision/SliderPrecision"));
const Raid = React.lazy(() => import("../../minigames/Raid/Raid"));
const Reorder = React.lazy(() => import("../../minigames/Reorder/Reorder"));

function MiniGames(props) {
  const navigate = useNavigate();

  function renderList() {
    return (
      <nav className="MiniGames__nav">
        <ul>
          <li>
            <VibrateLink color="info" href="/minigames/hangman">
              <span>Hangman</span>
              <span>🔡</span>
            </VibrateLink>
          </li>
          <li>
            <VibrateLink color="info" href="/minigames/targetpractice">
              <span>Target</span>
              <span>🎯</span>
              <span>Practice</span>
            </VibrateLink>
          </li>
          <li>
            <VibrateLink color="info" href="/minigames/raid">
              <span>Raid</span>
              <span>⚔️👹</span>
            </VibrateLink>
          </li>
          <li>
            <VibrateLink color="info" href="/minigames/reorder">
              <span>Reorder</span>
              <span>🔀</span>
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
            <h1 className="h3">Walk Hero</h1>
          </Link>
          <p>Minigames</p>
        </Col>
        <Col xs={4} className="MiniGames__back-btn">
          <VibrateButton color="link" onClick={() => navigate(-1)}>
            🔙
          </VibrateButton>
        </Col>
      </Row>
      <Routes>
        <Route index element={renderList()} />

        <Route
          path="hangman"
          element={
            <React.Suspense fallback={renderList()}>
              <Hangman minigames={props.minigames} />
            </React.Suspense>
          }
        />
        <Route
          path="targetpractice"
          element={
            <React.Suspense fallback={renderList()}>
              <SliderPrecision />
            </React.Suspense>
          }
        />
        <Route
          path="raid"
          element={
            <React.Suspense fallback={renderList()}>
              <Raid />
            </React.Suspense>
          }
        />
        <Route
          path="reorder"
          element={
            <React.Suspense fallback={renderList()}>
              <Reorder />
            </React.Suspense>
          }
        />
      </Routes>
      <Row>
        <Col className="MiniGames__stats">
          <span>💰 {props.minigames.cash}</span>
          <span>💖 {props.minigames.lives}</span>
          <span>📦 {props.minigames.resources}</span>
          <span>⚙️</span>
        </Col>
      </Row>
      <MiniGameEndModal
        isOpen={
          props.minigames.play_status === MINIGAME_STATUS.WON ||
          props.minigames.play_status === MINIGAME_STATUS.LOST
        }
        won={props.minigames.play_status === MINIGAME_STATUS.WON}
        msg={props.minigames.msg}
      />
    </React.Fragment>
  );
}

export default connect(store, {
  minigames: "minigames",
})(MiniGames);
