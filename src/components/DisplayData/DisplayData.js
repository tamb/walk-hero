import React from "react";
import PropTypes from "prop-types";
import {
  Table,
  Badge,
  Modal,
  ModalHeader,
  Container,
  Row,
  Col,
  Button,
} from "reactstrap";

import { toTime, toLatLong } from "./../../services/Geo";

function DisplayData(props) {
  return (
    <Modal {...props.modalProps} centered>
      <ModalHeader toggle={props.modalProps.toggle}>Data</ModalHeader>
      {props.start && (
        <Container>
          <Row>
            <Col>
              <Button onClick={props.lockScreen}>🔒 Lock Screen</Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <h2>Starting Data</h2>
              <Table responsive>
                <thead>
                  <tr>
                    <th>lat</th>
                    <th>lng</th>
                    <th>city</th>
                    <th>country</th>
                    <th>datetime</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{toLatLong(props.start)[0]}</td>
                    <td>{toLatLong(props.start)[1]}</td>
                    <td>{props.startingLocation.name}</td>
                    <td>{props.startingLocation.country}</td>
                    <td>{toTime(props.start)}</td>
                  </tr>
                </tbody>
              </Table>

              <h2>Current Traveling</h2>
              <Table responsive>
                <thead>
                  <tr>
                    <th>cm from start</th>
                    <th>cm just traveled</th>
                    <th>total cm</th>
                    <th>lat</th>
                    <th>lng</th>
                    <th>time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{props.distanceFromStartCM}</td>
                    <td>{props.distanceTraveledInCM}</td>
                    <td>{props.totalDistanceTraveledInCM}</td>
                    <td>{toLatLong(props.geoData)[0]}</td>
                    <td>{toLatLong(props.geoData)[1]}</td>
                    <td>{toTime(props.geoData)}</td>
                  </tr>
                </tbody>
              </Table>
              <section className="mb-3">
                <h2>Badges</h2>
                <div>
                  <Badge>hey</Badge>
                </div>
              </section>
            </Col>
          </Row>
        </Container>
      )}
    </Modal>
  );
}

DisplayData.propTypes = {
  start: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  distanceFromStartCM: PropTypes.number,
  totalDistanceTraveledInCM: PropTypes.number,
  startingLocation: PropTypes.object,
  geoData: PropTypes.object,
};

export default DisplayData;
