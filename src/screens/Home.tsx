import React, {
  ChangeEvent,
  FormEvent,
  FormEventHandler,
  useContext,
} from "react";
import "../STYLES/Home/Home.css";
import NavBar from "../components/NavBar";
import {
  Routes,
  Route,
  useLocation,
  useOutletContext,
  Outlet,
} from "react-router-dom";
import { userContextApi } from "../contextAPI/UserContextProvider";
import MainCenter from "../components/MainCenterSide/MainCenter";
import ChatSide from "../components/ChatNavSide/ChatSide";
import DrawerSide from "../components/DrawerNavSide/DrawerSide";
import { AnimatePresence, motion as m } from "framer-motion";
import Dialogue from "../components/MainCenterSide/card_component/Dialogue";
import ChatBox from "../components/MainCenterSide/card_component/ChatBox";
import { REDUCER_USER } from "../reducers_utils/reducer_user";

import { socket } from "../socket";
import DialoguePost from "../components/MainCenterSide/card_component/DialoguePost";
const Home = () => {
  interface PostMessage {
    senderId: string;
    message: string | undefined;
    image: string | undefined;
    createAt: string;
  }
  interface Text {
    master: number;
  }
  const [diaplayPost, setdiaplayPost] = React.useState<PostMessage[]>([]);
  const [message, setMessage] = React.useState<PostMessage | undefined>(
    undefined
  );

  const ref_dialogue = React.useRef<HTMLDivElement>(null);
  const { user, Dispatch, user_information } = useContext(userContextApi);

  const refChatBox = React.useRef<HTMLDivElement>(null);

  const [toggleChatbox, settoggleChatbox] = React.useState<boolean>(false);

  React.useEffect(() => {
    socket.emit("add_user", user_information);
    return () => {};
  }, [user_information._id]);
  return (
    <div className="container_Home">
      <DialoguePost
        toggle={user.toggle_dialogue_post}
        user={user}
        Dispatch={Dispatch}
      />
      <Dialogue
        topic="home"
        user={user}
        toggle={user.toggle_dialogue}
        Dispatch={Dispatch}
        ref={ref_dialogue}
        user_information={user_information}
      />
      <DrawerSide />
      <MainCenter />
      <ChatSide />
    </div>
  );
};

export default Home;
