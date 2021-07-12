import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import WiredApp from "./App";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <WiredApp />
  </React.StrictMode>,
  document.getElementById("root")
);

document.body.classList.add("ad-free");

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
