import React, { useContext } from "react";
import "../../STYLES/Home/component/ChatNavSide/ChatNavSide.css";
import { profile } from "console";
import { AiOutlineVideoCameraAdd, AiOutlineSearch } from "react-icons/ai";
import { SlOptions } from "react-icons/sl";
import { testArray } from "../../assets/piscum_and_avatar";
import { userContextApi } from "../../contextAPI/UserContextProvider";
import { REDUCER_USER } from "../../reducers_utils/reducer_user";
import { NAMES } from "../../assets/names/names_1";
import { MembersProps } from "../../screens/Main";
import FriendCard from "./Cards/FriendCard";
import Axios from "axios";
import { socket } from "../../socket";
import { userInformation } from "../../contextAPI/UserContextProvider";
import { ChatBoxContextApi } from "../../contextAPI/ChatBoxContextProvider";
import { REDUCER_CHATBOX } from "../../reducers_utils/reducer_chatbox";
export interface onlineUser {
  socketId: string;
  user: userInformation;
}
const ChatSide = () => {
  const { user, Dispatch, user_information } = useContext(userContextApi);
  const { dataChat, Dispatch_chatbox } = useContext(ChatBoxContextApi);
  const [chatUsers, setchatUsers] = React.useState<MembersProps[]>([]);

  const [onlineUsers, setonlineUsers] = React.useState<onlineUser[]>([]);
  async function fetchFriend() {
    const url =
      process.env.REACT_APP_PORT + "/friend/api/find/" + user_information._id;
    const data = {
      senderId: user_information._id,
    };
    const response = await Axios(url, {
      method: "get",
      headers: { "Content-Type": "application/json" },
      data,
    });

    const chatUser = response.data.result;
    if (response.status === 200) {
      // alert(response.data.message);
      setchatUsers((prev) => chatUser);
    }
  }
  ///socket
  function socketGetUSer(online_user: onlineUser[]) {
    setonlineUsers((prev) => online_user); // global
    Dispatch_chatbox({
      type: REDUCER_CHATBOX.SET_ONLINE_USERS,
      payload: { dataChat: { ...dataChat, onlineUsers: online_user } },
    });
  }
  React.useEffect(() => {
    user_information._id && fetchFriend();
    return () => {};
  }, [user_information._id]);

  React.useEffect(() => {
    socket.on("get_user", socketGetUSer); //
    return () => {
      socket.off("get_user", socketGetUSer);
    };
  }, [socket]);
  return (
    <div className="container_chat_side">
      <ul className="container_lists_chat">
        {/* header */}
        <li className="card_friend_list">
          <span>Happy BirthDay</span>
        </li>
        {/* des */}
        <li>
          <div className="wrapper_birth_day">
            <img
              src={require("../../assets/logo_drawer/gift-box.png")}
              alt=""
            />
          </div>
          <span className="wrapper_desc_birth_Day">
            Happy BirthDay : Today is the wang rochi's birthday.
          </span>
        </li>
      </ul>
      <ul className="container_lists_chat">
        <li className="card_friend_list contact">
          <span className="friend">Friends</span>
          <div className="container_tools">
            <span className="wrapper_icon">
              <AiOutlineVideoCameraAdd size={25} className="icon" />
            </span>
            <span className="wrapper_icon">
              <AiOutlineSearch size={25} className="icon" />
            </span>
            <span className="wrapper_icon">
              <SlOptions size={25} className="icon" />
            </span>
          </div>
        </li>
        {chatUsers &&
          chatUsers.map((item, index) => (
            <FriendCard
              key={index}
              item={item}
              userID={user_information._id}
              onlineUsers={dataChat.onlineUsers}
            />
          ))}
      </ul>
      <div className="description">
        <div className="sub_desc">
          Privacy · Condition · Advertisement · Options · Cookies · · Meta ©
          2023
        </div>
      </div>
    </div>
  );
};

export default ChatSide;
