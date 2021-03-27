import React from "react";
import PropTypes from "prop-types";

import "./Map.scss";
import knight from "@gif/knightherov3.gif";
import npc from "@gif/npc-help.png";

// tile layer design:
// http://maps.stamen.com/#watercolor/12/37.7706/-122.3782

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.map = null;
    this.userMarker = null;
    this.npcIcon = null;
    this.npcMarker = null;
    this.myIcon = null;
  }

  componentDidMount(){
    console.log("mount map");
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
      this.addNPC();
    }

    if (this.map) {
      this.moveUserCursor();
      this.map.panTo(this.props.currentLatLong, { animate: true });
    }
  }

  // can make generic to make items etc that disappear after x seconds
  addNPC = () => {
    this.npcIcon = window.L.icon({
      iconUrl: npc,
      iconSize: [75, 75],
      iconAnchor: [25, 65],
    });
    this.npcMarker = window.L.marker(this.calculateNPCCoords(), {
      draggable: false,
      icon: this.npcIcon,
    }).addTo(this.map);
  };

  calculateNPCCoords = () => {
    const addLat = Math.floor(Math.random() * 10) % 2 === 0 ? -0.002 : 0.002;
    const addLng = Math.floor(Math.random() * 10) % 2 === 0 ? -0.002 : 0.002;
    const npcLat = this.props.currentLatLong[0] + addLat;
    const npcLng = this.props.currentLatLong[1] + addLng;
    return [npcLat, npcLng];
  };

  moveUserCursor = () => {
    if (this.userMarker) {
      this.userMarker.setLatLng(this.props.currentLatLong);
    } else {
      this.myIcon = window.L.icon({
        iconUrl: knight,
        iconSize: [75, 75],
        iconAnchor: [25, 65],
      });
      this.userMarker = window.L.marker(this.props.currentLatLong, {
        draggable: false,
        icon: this.myIcon,
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
    return <div id="map" data-paused={this.props.paused}></div>;
  }
}

Map.propTypes = {
  geoData: PropTypes.object,
  currentLatLong: PropTypes.arrayOf(PropTypes.number),
  hasLocation: PropTypes.bool,
  paused: PropTypes.bool,
};

export default Map;
