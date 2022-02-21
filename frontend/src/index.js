import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { createStore } from "redux";
import { Provider } from "react-redux";
import rootReducer from "./modules";
import { composeWithDevTools } from "redux-devtools-extension";
import SetAuth from "./components/accounts/SetAuth";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import 'bootstrap/dist/css/bootstrap.css';

const store = createStore(rootReducer, composeWithDevTools());
const persistor = persistStore(store);
// SetAuth(localStorage.jwt);

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}></PersistGate>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById("root")
);
