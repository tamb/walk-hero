import { Fragment } from "inferno";
// import styled from 'styled-components';
import './index.scss';
import Slider from "./Slider";
import Stage from "./Stage";

// const ControlsStyles = styled("div")`
//   display: flex;
//   flex: 1;
// `;

// const SlidersContainer = styled("div")`
//   position: relative;
//   width: 75%;
//   flex-direction: column;
//   display: flex;
//   justify-content: space-around;
// `;
// const FireButton = styled("div")`
//   position: relative;
//   width: 25%;
//   display: flex;
//   align-content: center;
//   justify-content: center;
// `;

export default function Controls() {
  return (
    <Fragment>
      <Stage />
      <div className="control-styles">
        <div className="slider-container">
          <Slider bg="#00B7EF" />
          <Slider bg="#FF3333" />
        </div>
        <div className="fire-button">
          <button>fire</button>
        </div>
      </div>
    </Fragment>
  );
}
