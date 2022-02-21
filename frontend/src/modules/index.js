import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import member from "./member";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  member,
});

export default persistReducer(persistConfig, rootReducer);
