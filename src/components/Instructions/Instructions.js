import React from "react";
// import PropTypes from "prop-types";

function Instructions(props) {
  return (
    <div>
      <h2>How to play:</h2>
      <ul>
        <li>
          Track how far you've walked 🗺️ and in what amount of time ⏱️
          {/* <ul>
            <li>
              As you walk you will continue to earn badges 🏆 for the ground you
              cover.
            </li>
            <li>Some badges may possess special gifts: 💗 ⚗️ 💰 🆙</li>
          </ul> */}
        </li>

        {/* <li>
          As you're walking you may see {props.ncpType} asking for help 🙋 🙋‍♂️
        </li>
        <li>
          <ul>
            <li>Tapping on them allows you to interact.</li>
            <li>
              They may reward you for efforts or they may luring you into a
              trap...
            </li>
          </ul>
        </li>
        <li>You can adjust settings in menu ⚙️</li> */}
      </ul>
    </div>
  );
}

Instructions.propTypes = {};

export default Instructions;
