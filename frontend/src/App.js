import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import Signup from "./components/accounts/Signup";
import Login from "./components/accounts/Login";
import MyPage from "./components/accounts/MyPage";
import MyPageEdit from "./components/accounts/MyPageEdit";
import Profile from "./components/accounts/Profile";
import Message from "./components/dm/Message";
import MessageWrite from "./components/dm/MessageWrite";
import MessageTo from "./components/dm/MessageTo";
import MessageRead from "./components/dm/MessageRead";
import BroadMake from "./components/broad/BroadMake";
import Broad from "./components/broad/Broad"
import Footer from "./components/Footer"
// import BroadTest from "./components/broad/Broadtest"
import "./App.css";
// import {Helmet} from "react-helmet";

import { useState } from "react/cjs/react.development";

function App() {
  return (
    <div>
      {/* <Helmet> */}
        {/* <script src="https://i6c110.p.ssafy.io:8443/js/kurento-utils.js"></script> */}
        {/* <script src="../public/js/kurento-u.js"></script> */}
      {/* </Helmet> */}
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/mypageedit" element={<MyPageEdit />} />
          <Route path="/message" element={<Message />} />
          <Route path="/message/write" element={<MessageWrite />} />
          <Route path="/messageto/:to_nickname" element={<MessageTo />} />
          <Route path="/messageread/:dm_id" element={<MessageRead />} />
          <Route path="/profile/:nickname" element={<Profile />} />
          <Route path="/makebroad" element={<BroadMake />} />
          <Route path="/watch/:broadid/:viewerid/:mynickname" element={<Broad />} />
          {/* <Route path="/watch/:nickname" element={<BroadTest />} /> */}
        </Routes>
        {/* <Footer /> */}
      </BrowserRouter>
    </div>
  );
}

export default App;
