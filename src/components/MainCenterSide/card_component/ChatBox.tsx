import React, { ChangeEvent, Ref } from "react";
import "../../../STYLES/Home/component/ChatBox/ChatBox.css";
import MessageCard from "./MessageCard";
import { AnimatePresence } from "framer-motion";
import { motion as m } from "framer-motion";
import { animation_translateY, animation_scale } from "../../../assets/motion";
import { testArray } from "../../../assets/piscum_and_avatar";
import { IoMdCall, IoMdSend } from "react-icons/io";
import { BsDashLg } from "react-icons/bs";
import { GrClose } from "react-icons/gr";
import { BsCameraVideoFill, BsFillEmojiSmileFill } from "react-icons/bs";
import { BiMicrophone } from "react-icons/bi";
import {
  AiFillPlusCircle,
  AiFillFileImage,
  AiOutlineFileGif,
} from "react-icons/ai";

import {
  Actions,
  userContextApi,
} from "../../../contextAPI/UserContextProvider";
import { REDUCER_USER } from "../../../reducers_utils/reducer_user";
import { userProps } from "../../../contextAPI/UserContextProvider";
import { ChatBoxContextApi } from "../../../contextAPI/ChatBoxContextProvider";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import Axios from "axios";
import { socket } from "../../../socket";
import {
  Icon_input_tools,
  Icon_switch,
  icon_input_tools,
  icon_tools,
} from "../../UTIL_KEEP_STUFF";
export interface MessageProps {
  senderId: string;
  receiverId: string;
  text: string;
  photoURL?: string;
  sendAt: string;
  conversationId: string;
}

interface ChatBoxProps {
  user: userProps;
  toggle: boolean | undefined;
  Dispatch: React.Dispatch<Actions>;
}
const ChatBox = React.forwardRef<HTMLDivElement, ChatBoxProps>(
  ({ toggle, Dispatch, user }, ref: Ref<HTMLDivElement>) => {
    const { isLoaded } = useJsApiLoader({
      googleMapsApiKey: process.env.REACT_APP_MAP_KEY + "",
    });
    const [displayMessage, setdisplayMessage] = React.useState<MessageProps[]>(
      []
    );
    const { user_information } = React.useContext(userContextApi);
    const { dataChat } = React.useContext(ChatBoxContextApi);

    const [isOnline, setisOnline] = React.useState<boolean>(false);
    const [message, setMessage] = React.useState<string>("");

    //message
    function sendChatBoxMessage(e: ChangeEvent<HTMLInputElement>) {
      setMessage((prev) => e.target.value);
    }

    async function SendMessage() {
      if (dataChat.chatuser) {
        const Message: MessageProps = {
          receiverId: user_information._id,
          senderId: dataChat.chatuser._id,
          text: message,
          sendAt: new Date().toLocaleString("en-US", {
            day: "numeric",
            month: "short",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          }),
          conversationId: dataChat.conversationId,
        };

        const url = process.env.REACT_APP_PORT + "/message/api/add";
        const response = await Axios(url, {
          method: "post",
          headers: { "Content-Type": "application/json" },
          data: Message,
        });

        if (response.status === 200) {
          const message = response.data.message;
          socket.emit("add_message", Message);
          setdisplayMessage((prev) => [...prev, Message]);
          setMessage((prev) => "");
        }
      }
    }

    async function fetchMessage() {
      const url =
        process.env.REACT_APP_PORT + "/message/api/" + dataChat.conversationId;
      const response = await Axios(url, {
        method: "get",
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200) {
        const arraivalMessage = response.data.result;
        setdisplayMessage((prev) => arraivalMessage);
      }
    }
    function CompareisToDay(date: string): boolean {
      // Create a new Date object for the given date string
      const givenDate = new Date(date);

      // Get the current date
      const currentDate = new Date();
      const isToday =
        givenDate.getMonth() === currentDate.getMonth() &&
        givenDate.getDate() === currentDate.getDate();

      return isToday;
    }

    function checkOnline() {
      const current_online_id = dataChat.onlineUsers?.map(
        (item, index) => item.user._id
      );
      if (dataChat.chatuser) {
        const online = current_online_id?.includes(dataChat.chatuser._id);

        if (online) {
          setisOnline((prev) => true);
        } else {
          setisOnline((prev) => false);
        }
      }
    }
    function socketArraivalMessage(arrailvalMessage: MessageProps) {
      console.log("message", arrailvalMessage.text);

      setdisplayMessage((prev) => [...prev, arrailvalMessage]);
    }
    React.useEffect(() => {
      checkOnline();
      return () => {};
    }, [dataChat.onlineUsers, dataChat.conversationId]);
    React.useEffect(() => {
      if (displayMessage.length === 0 && dataChat.conversationId) {
        fetchMessage();
      }

      if (dataChat.conversationId) {
        fetchMessage();
      }
      return () => {};
    }, [dataChat.conversationId, user_information._id]);

    React.useEffect(() => {
      socket.on("get_message", socketArraivalMessage);
      return () => {
        socket.off("get_message", socketArraivalMessage);
      };
    }, [socket]);

    return (
      <AnimatePresence>
        {toggle && (
          <m.div
            ref={ref}
            onMouseDown={(e) => e.stopPropagation()}
            className="container_chat"
            variants={animation_translateY}
            initial="hidden"
            animate="show"
            exit="remove"
          >
            {/* Profile contactor */}
            <div className="section1">
              <div className="wrapper_image">
                <img
                  src={
                    dataChat?.chatuser?.photoURL
                      ? dataChat.chatuser.photoURL
                      : testArray[0].profile
                  }
                  alt=""
                />
                <span
                  className="online"
                  style={{
                    backgroundColor: isOnline ? "mediumseagreen" : "crimson",
                  }}
                />
              </div>

              <div className="desc">
                <span className="name">{dataChat.chatuser?.username}</span>
                <span className="available">
                  {isOnline ? "available" : "unavailable"}
                </span>
              </div>
              {/* DisplayMessage */}
              <div className="container">
                {icon_tools &&
                  icon_tools.map((item, index) => (
                    <span key={index} className="wrapper_icon">
                      {Icon_switch(item, Dispatch, user)}
                    </span>
                  ))}
              </div>
            </div>
            <div className="section2">
              <div className="container_message">
                {displayMessage &&
                  displayMessage.map((item, index) => {
                    const isToday = CompareisToDay(item.sendAt);
                    let isAlreadyset = false;
                    let isJustNow = false;

                    if (index > 0 && isToday) {
                      const previousMessage = displayMessage[index - 1];
                      const previousMessageIsToday = CompareisToDay(
                        previousMessage.sendAt
                      );

                      if (previousMessageIsToday) {
                        isAlreadyset = true;
                      }
                    }

                    if (index === displayMessage.length - 1) {
                      isJustNow = true;
                    }
                    return (
                      <MessageCard
                        key={index}
                        item={item}
                        index={index}
                        sendAt={item.sendAt}
                        isToday={isToday}
                        isAlreadyset={isAlreadyset}
                        isJustNow={isJustNow}
                      />
                    );
                  })}
              </div>
            </div>
            {/* Input DisplayMessage */}
            <div className="section3">
              {icon_input_tools &&
                icon_input_tools.map((item, index) => (
                  <span key={index} className="send" onClick={SendMessage}>
                    {Icon_input_tools(item, message)}
                  </span>
                ))}
              <input
                style={{ width: message && "250px" }}
                type="text"
                placeholder="@Aa"
                value={message}
                onChange={sendChatBoxMessage}
              />

              {message ? (
                <m.span className="send" onClick={SendMessage}>
                  <IoMdSend color="rgb(0, 132, 255)" size={20} />
                </m.span>
              ) : (
                <m.span className="send" onClick={SendMessage}>
                  <BiMicrophone color="rgb(0, 132, 255)" size={20} />
                </m.span>
              )}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    );
  }
);

export default React.memo(ChatBox);
