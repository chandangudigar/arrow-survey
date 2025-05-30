import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Signin from "./signin/Signin";
import Main from "./main/Main";
import Workorder from "./main/Workorder";
import Create_Workorder from "./main/Create_Workorder";
import Workorder_Survey from "./main/Workorder_Survey";
import Survey from "./main/Survey";
import Create_Survey from "./main/Create_Survey";
import { PrivateRoute } from "./main/PrivateRoute";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
