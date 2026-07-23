import "./demo/boot"; // PRIMEIRA linha — instala o mock server antes do React
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./main/App";
import * as serviceWorker from "./serviceWorker";
// src/config/aws é interceptado pelo alias vite → aws-config-noop.js
import "./config/aws";
import DemoErrorBoundary from "./demo/DemoErrorBoundary";

ReactDOM.render(
  <DemoErrorBoundary>
    <App />
  </DemoErrorBoundary>,
  document.getElementById("root")
);

serviceWorker.unregister();
