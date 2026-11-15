import React from "react";
import { render, screen } from "@testing-library/react";
import { Col, Row } from "reactstrap";
import { describe, expect, it } from "vite-plus/test";

describe("React 19 reactstrap defaults", () => {
  it("still applies row and column classes", () => {
    render(
      <Row>
        <Col xs={12}>Tile</Col>
      </Row>,
    );

    const tile = screen.getByText("Tile");
    expect(tile).toHaveClass("col-12");
    expect(tile.parentElement).toHaveClass("row");
  });
});
