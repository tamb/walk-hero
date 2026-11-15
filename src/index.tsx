import "./react19-compat";
import React from "react";
import { createRoot } from "react-dom/client";
import "./index.scss";
import reportWebVitals from "./reportWebVitals";
import "tocada";

const WiredApp = React.lazy(() => import("./App"));
function Blank() {
  return <div></div>;
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element #root was not found");
}

createRoot(rootElement).render(
  <React.StrictMode>
    <React.Suspense fallback={<Blank />}>
      <WiredApp />
    </React.Suspense>
  </React.StrictMode>,
);

document.body.classList.add("ad-free");

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
