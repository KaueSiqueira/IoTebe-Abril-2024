import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import "./App.css";
import React from "react";
import Routes from "./Routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default () => (
  <>
    <Routes />
    <ToastContainer
      position="bottom-left"
      theme="colored"
      pauseOnFocusLoss={false}
    />
  </>
);
