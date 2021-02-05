import React from "react";
import PropTypes from "prop-types";

import { toLatLong } from "./../../services/Geo";

import "./Map.scss";

// tile layer design:
// http://maps.stamen.com/#watercolor/12/37.7706/-122.3782

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
      window.L.tileLayer(
        "https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg",
        {
          attribution:
            'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.',
          subdomains: ["a", "b", "c"],
        }
      ).addTo(this.map);
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
    return <div id="map"></div>;
  }
}

Map.propTypes = {
  geoData: PropTypes.object,
};

export default Map;
