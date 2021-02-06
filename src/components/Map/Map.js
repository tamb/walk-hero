import React from "react";
import PropTypes from "prop-types";

import "./Map.scss";
import knight from "./../../gif/knightherov3.gif";

// tile layer design:
// http://maps.stamen.com/#watercolor/12/37.7706/-122.3782

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.map = null;
    this.userMarker = null;
  }

  componentDidUpdate() {
    if (this.props.hasLocation && this.map === null) {
      this.map = window.L.map("map", {
        minZoom: 10,
      }).setView(this.props.currentLatLong, 17);
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
      this.map.panTo(this.props.currentLatLong, { animate: true });
    }
  }

  moveUserCursor = () => {
    if (this.userMarker) {
      this.userMarker.setLatLng(this.props.currentLatLong);
    } else {
      const myIcon = window.L.icon({
        iconUrl: knight,
        iconSize: [75, 75],
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76],
        shadowSize: [68, 95],
        shadowAnchor: [22, 94],
      });
      this.userMarker = window.L.marker(this.props.currentLatLong, {
        draggable: false,
        icon: myIcon,
      }).addTo(this.map);
    }
  };

  render() {
    // if (this.map) {
    //   this.map.panTo(toLatLong(this.props.geoData), { animate: true });
    // }

    // if (this.userMarker) {
    //   this.userMarker.setLatLong(toLatLong(this.props.geoData));
    // }
    return <div id="map"></div>;
  }
}

Map.propTypes = {
  geoData: PropTypes.object,
  currentLatLong: PropTypes.arrayOf(PropTypes.number),
  hasLocation: PropTypes.bool,
};

export default Map;
