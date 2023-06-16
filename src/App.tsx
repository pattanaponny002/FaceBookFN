import React, { ChangeEvent, useContext } from "react";
import { motion as m, AnimatePresence } from "framer-motion";
import {
  Route,
  Routes,
  useLocation,
  Outlet,
  useOutletContext,
} from "react-router-dom";
import "./STYLES/App/App.css";
import Home from "./screens/Home";
import Login from "./screens/Login";
import Main from "./screens/Main";
import NavBar from "./components/NavBar";
import { AiOutlineMenu } from "react-icons/ai";
import UserContextProvider, {
  userContextApi,
} from "./contextAPI/UserContextProvider";
import MainContextProvider from "./contextAPI/MainContextProvider";
import ChatBoxContextProvider from "./contextAPI/ChatBoxContextProvider";
import ChatBox from "./components/MainCenterSide/card_component/ChatBox";
import { REDUCER_USER } from "./reducers_utils/reducer_user";
function App() {
  const location = useLocation();
  const shouldShowNavBar = location.pathname !== "/";
  const refChatBox = React.createRef<HTMLDivElement>();

  const { user, Dispatch } = useContext(userContextApi);

  // function handlerMouseDonw(e: MouseEvent) {
  //   !refChatBox?.current?.contains(e.target as Node) &&
  //     Dispatch({
  //       type: REDUCER_USER.TOGGLE_CHATBOX,
  //       payload: { ...user, toggle_chat_box: false },
  //     });
  // }
  return (
    <div className="container_App">
      {/* login to Home  */}

      {shouldShowNavBar && (
        <ChatBox
          ref={refChatBox}
          user={user}
          toggle={user.toggle_chat_box}
          Dispatch={Dispatch}
        />
      )}
      {shouldShowNavBar && <NavBar />}
      <Routes>
        <Route index element={<Login />} />
        <Route path="Home" element={<Home />} />
        <Route path="Main" element={<Main />} />
      </Routes>
    </div>
  );
}

export default App;
