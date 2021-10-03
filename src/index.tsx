import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import reportWebVitals from "./reportWebVitals";
import "tocada";

const WiredApp = React.lazy(() => import("./App"));
function Blank() {
  return <div></div>;
}

ReactDOM.render(
  <React.StrictMode>
    <React.Suspense fallback={<Blank />}>
      <WiredApp />
    </React.Suspense>
  </React.StrictMode>,
  document.getElementById("root")
);

document.body.classList.add("ad-free");

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
