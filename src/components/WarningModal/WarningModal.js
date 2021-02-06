import React from "react";
// import PropTypes from "prop-types";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Container,
  Row,
  Col,
} from "reactstrap";

function WarningModal(props) {
  return (
    <Modal isOpen={props.isOpen} centered backdrop="static" keyboard={false}>
      <ModalHeader>WARNING:</ModalHeader>
      <ModalBody>
        <Container fluid>
          <Row>
            <Col>
              Note:
              <ul>
                <li>Please pay attention to your surroundings at all times.</li>
                <li>
                  We do not share your location information with anyone else.
                </li>
                <li>We do not intend to infringe on any copyrights.</li>
              </ul>
            </Col>
          </Row>
        </Container>
      </ModalBody>
      <ModalFooter>
        <Button color="success" onClick={props.toggle}>
          I accept
        </Button>
      </ModalFooter>
    </Modal>
  );
}

// WarningModal.propTypes = {};

export default WarningModal;
