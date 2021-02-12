import 'inferno';
// import styled from 'styled-components';
// import { styled } from 'Utils/styled.js';
import './index.scss'

// const SliderStyles = styled('div')`

//   width: 100%; /* Width of the outside container */
  
//   /* The slider itself */
//   input {
//     -webkit-appearance: none;  /* Override default CSS styles */
//     appearance: none;
//     width: 100%; /* Full-width */
//     height: 5px; /* Specified height */
//     background: #000000; /* Grey background */
//     outline: none; /* Remove outline */
//     opacity: 1; /* Set transparency (for mouse-over effects on hover) */
//     -webkit-transition: .2s; /* 0.2 seconds transition on hover */
//     transition: opacity .2s;
//   }
  
//   /* Mouse-over effects */
//   input:hover {
//     opacity: 1; /* Fully shown on mouse-over */
//   }
  
//   /* The slider handle (use -webkit- (Chrome, Opera, Safari, Edge) and -moz- (Firefox) to override default look) */ 
//   input::-webkit-slider-thumb {
//     -webkit-appearance: none; /* Override default look */
//     appearance: none;
//     width: 40px; /* Set a specific slider handle width */
//     height: 40px; /* Slider handle height */
//     border-radius: 50%;
//     background: ${props => props.bg}; /*  background */
//     cursor: pointer; /* Cursor on hover */
//     box-shadow: 2px 2px 10px rgba(0,0,0,.5);
//   }
  
//   input::-moz-range-thumb {
//     width: 40px; /* Set a specific slider handle width */
//     height: 40px; /* Slider handle height */
//     border-radius: 50%;
//     background: ${props => props.bg}; /* background */
//     cursor: pointer; /* Cursor on hover */
//     box-shadow: 2px 2px 10px rgba(0,0,0,.5);
//   }
// `;

const Slider = () => {
  return (
    <div className="slider">
        <input type="range" min="1" max="100" value="50"/>
    </div>
  )
}

Slider.defaultProps = {
  bg: `#000000`
};

export default Slider;
