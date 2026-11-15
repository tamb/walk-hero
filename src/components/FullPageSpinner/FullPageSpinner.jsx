import React from "react";
import { Spinner } from "reactstrap";

const FullPageSpinner = () => (
  <div
    className="d-flex justify-content-center align-items-center"
    style={{
      height: "100vh",
      width: "100%",
    }}
  >
    <Spinner color="primary" />
  </div>
);

export default FullPageSpinner;
