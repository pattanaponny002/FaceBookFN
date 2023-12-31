import React, { MouseEventHandler, useState } from "react";
import Axios from "axios";
import { MembersProps } from "../../../screens/Main";
import {
  userContextApi,
  userInformation,
} from "../../../contextAPI/UserContextProvider";
import { REDUCER_USER } from "../../../reducers_utils/reducer_user";
import { REDUCER_CHATBOX } from "../../../reducers_utils/reducer_chatbox";
import { ChatBoxContextApi } from "../../../contextAPI/ChatBoxContextProvider";
import { onlineUser } from "../ChatSide";
import { DataChatProps } from "../../../contextAPI/ChatBoxContextProvider";
import { socket } from "../../../socket";
import empty_user from "../../../assets/logos/user (3).png";
interface FriendCardProps {
  item: MembersProps;
  userID: string;
  onlineUsers: onlineUser[] | undefined;
  index: number;
}
const FriendCard = ({ item, userID, onlineUsers, index }: FriendCardProps) => {
  const [chat, setchat] = React.useState<userInformation>();
  const { user, Dispatch, user_information } = React.useContext(userContextApi);
  const [online, setonline] = React.useState<boolean>(false);
  const { dataChat, Dispatch_chatbox } = React.useContext(ChatBoxContextApi);
  async function fetchUSer(item: MembersProps) {
    const friendId = item.members.find((member) => member !== userID);

    const url = process.env.REACT_APP_PORT + "/user/api/findByID/" + friendId;

    if (friendId) {
      try {
        const response = await Axios(url, { method: "get" });
        if (response.status === 200) {
          const userChat = response.data.result;
          //   alert(message);

          setchat((prev) => ({ ...prev, ...userChat }));
        }
      } catch (err) {
        alert("ERROR");
        console.log("FRIEND CARD /t", err);
      }
    }
  }

  function checkOnline(userChat: userInformation) {
    const online_id = onlineUsers?.map(
      (online_users, index) => online_users.user._id
    );
    if (chat && online_id) {
      const checked = online_id.includes(chat._id);
      setonline(checked);
    }
  }

  async function addConversation(e: React.MouseEvent<HTMLLIElement>) {
    // addConversation();
    // ToggleDown
    if (chat?._id) {
      try {
        //recieverID ***********
        const data = {
          senderId: user_information._id,
          receiverId: chat._id,
        };
        const url = process.env.REACT_APP_PORT + "/conversation/api/add";
        const response = await Axios(url, {
          method: "post",
          data,
          headers: { "Content-Type": "application/json" },
        });
        /// this is on the disffernce state
        if (response.status === 200) {
          const conversation = response.data.result;

          ///find not findOne for checking so we would like to add [0]
          ///?

          if (conversation) {
            Dispatch({
              type: REDUCER_USER.TOGGLE_CHATBOX,
              payload: { ...user, toggle_chat_box: true },
            });
            Dispatch_chatbox({
              type: REDUCER_CHATBOX.SET_CURRENT_CHATBOX,
              payload: {
                dataChat: {
                  ...dataChat,
                  chatuser: chat,
                  conversationId: conversation?._id,
                },
              },
            });
            socket.emit("join_room", conversation);
          }
        }
      } catch (err) {
        alert("failed conversation FriendCard");
      }
      ////
    }

    // Dispatch_chatbox({
    //   type: REDUCER_CHATBOX.SET_CURRENT_CHATBOX,
    //   payload: { ...data, ...chat },
    // });
    /// setting conversation
  }

  React.useEffect(() => {
    if (!chat) {
      fetchUSer(item);
    }
    return () => {};
  }, []);
  React.useEffect(() => {
    chat && onlineUsers && checkOnline(chat);

    ///setOnline
    return () => {};
  }, [chat?._id, onlineUsers]);
  return (
    <li className="card_friend_list" onMouseDown={addConversation}>
      <div className="wrapper_profile">
        {chat?.photoURL ? (
          <img src={chat?.photoURL} alt="" />
        ) : (
          <img src={empty_user} alt="" />
        )}
        <span
          className="online"
          style={{ backgroundColor: online ? "mediumseagreen" : "crimson" }}
        />
      </div>
      <span>{chat?.username}</span>
    </li>
  );
};

export default React.memo(FriendCard);
