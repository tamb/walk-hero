import React from "react";
import PropTypes from "prop-types";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";

const NameModal = (props) => {
  function handleSubmit(event) {
    event.preventDefault();
    //set perm state and save
    props.setHeroName();
  }
  return (
    <Modal>
      <Form onSubmit={handleSubmit}>
        <ModalHeader>Speak your name, brave hero!</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label htmlFor="name">I am</Label>
            <Input
              onChange={props.handleNameInputChange}
              name="name"
              id="name"
              value={props.hero.name}
            />
          </FormGroup>
          <Container fluid>
            <Row>
              <Col>
                {props.hero.name && (
                  <p>
                    "I am
                    <strong className="text-uppercase">{props.hero.name}</strong>
                    !"
                  </p>
                )}
              </Col>
            </Row>
          </Container>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" block>
            Speak thy name!
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

NameModal.propTypes = {
  hero: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  }),
  handleNameInputChange: PropTypes.func,
  setHeroName: PropTypes.func,
};
