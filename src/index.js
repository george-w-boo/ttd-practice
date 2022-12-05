import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import reportWebVitals from "./reportWebVitals";

import "./locale/i18n";
import { browserRouter } from "./routers";
import { Provider } from "react-redux";
import { legacy_createStore } from "redux";

const reducer = (state, action) => {
  console.log({ state, action });

  switch (action.type) {
    case "LOGIN-SUCCESS":
      return {
        ...state,
        id: action.payload.id,
        isLoggedIn: true,
      };
    default:
      return state;
  }
};

const initialState = {
  isLoggedIn: false,
  id: "",
};

const store = legacy_createStore(reducer, initialState);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={browserRouter} />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
