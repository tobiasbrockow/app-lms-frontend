import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { store } from "./app/store";
import { Provider } from "react-redux";
import Sidebar from "./components/Sidebar/Sidebar";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Sidebar />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
