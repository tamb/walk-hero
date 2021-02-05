import React from "react";
import PropTypes from "prop-types";

import { toLatLong } from "./../../services/Geo";

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.map = null;
  }

  componentDidUpdate() {
    if (this.props.geoData.coords.latitude && this.map === null) {
      this.map = window.L.map("map", {
        minZoom: 10,
      }).setView(toLatLong(this.props.geoData), 17);
      window.L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: ["a", "b", "c"],
      }).addTo(this.map);
      this.moveUserCursor();
    }

    if (this.map) {
      this.moveUserCursor();
    }
  }

  moveUserCursor = () => {
    if (this.userMarker) {
      this.userMarker.update();
    } else {
      this.userMarker = window.L.marker(toLatLong(this.props.geoData), {
        draggable: false,
      }).addTo(this.map);
    }
  };

  render() {
    return <div style={{ width: "50vw", height: "50vh" }} id="map"></div>;
  }
}

Map.propTypes = {
  geoData: PropTypes.object,
};

export default Map;
