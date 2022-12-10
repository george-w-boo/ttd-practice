import { legacy_createStore } from "redux";
import authReducer from "./authReducer";

const createAppStore = () => {
  let initialState = {
    isLoggedIn: false,
    id: "",
  };

  const storeFromLS = localStorage.getItem("auth");

  if (storeFromLS !== null) {
    try {
      initialState = JSON.parse(storeFromLS);
    } catch (error) {}
  }

  const store = legacy_createStore(
    authReducer,
    initialState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

  store.subscribe(() => {
    localStorage.setItem("auth", JSON.stringify(store.getState()));
  });

  return store;
};

export default createAppStore;
