import axios from "axios";

function SetAuth(token) {
  if (token) {
    axios.defaults.headers.common["Authotization"] = "Bearer ${token}";
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
}

export default SetAuth;
