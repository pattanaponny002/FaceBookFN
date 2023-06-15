import React, { ChangeEvent } from "react";
import "../../../STYLES/Home/component/ChatBox/ChatBox.css";
import { timeStamp } from "console";
import MessageCard from "./MessageCard";
import { AnimatePresence } from "framer-motion";
import { motion as m } from "framer-motion";
import { animation_translateY, animation_scale } from "../../../assets/motion";
import { testArray } from "../../../assets/piscum_and_avatar";
import { IoMdCall, IoMdSend } from "react-icons/io";
import { BsCameraVideoFill, BsFillEmojiSmileFill } from "react-icons/bs";
import { BsDashLg } from "react-icons/bs";
import { GrClose } from "react-icons/gr";
import {
  AiFillPlusCircle,
  AiFillFileImage,
  AiOutlineFileGif,
} from "react-icons//ai";
import { BiMicrophone } from "react-icons/bi";
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
export interface MessageProps {
  senderId: string;
  receiverId: string;
  text: string;
  photoURL?: string;
  sendAt: string;
  conversationId: string;
}

interface ChatBoxProps {
  ref: React.RefObject<HTMLDivElement>;
  user: userProps;
  toggle: boolean | undefined;
  Dispatch: React.Dispatch<Actions>;
}
const ChatBox = ({ ref, toggle, Dispatch, user }: ChatBoxProps) => {
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
  function sendChatBoxMessage(e: ChangeEvent<HTMLInputElement>) {
    setMessage((prev) => e.target.value);
  }
  const icon_tools = ["IoMdCall", "BsCameraVideoFill", "BsDashLg", "GrClose"];
  const icon_input_tools = [
    "AiFillPlusCircle",
    "AiFillFileImage",
    "AiOutlineFileGif",
    "BsFillEmojiSmileFill",
  ];
  function Icon_switch(icon: string) {
    switch (icon) {
      case "IoMdCall":
        return <IoMdCall size={15} color="black" className="icon" />;
      case "BsCameraVideoFill":
        return <BsCameraVideoFill size={15} color="black" className="icon" />;
      case "BsDashLg":
        return <BsDashLg size={15} color="black" className="icon" />;
      case "GrClose":
        return (
          <GrClose
            size={15}
            color="black"
            className="icon"
            onMouseDown={(e) => {
              e.stopPropagation();
              Dispatch({
                type: REDUCER_USER.TOGGLE_CHATBOX,
                payload: { ...user, toggle_chat_box: false },
              });
            }}
          />
        );

      default:
        return null;
    }
  }
  function Icon_input_tools(icon: string) {
    switch (icon) {
      case "AiFillPlusCircle":
        return (
          <AiFillPlusCircle
            size={20}
            color="rgb(0, 132, 255)"
            className="icon"
          />
        );
      case "AiFillFileImage":
        return (
          <AiFillFileImage
            style={{ display: message && "none" }}
            size={20}
            color="rgb(0, 132, 255)"
            className="icon"
          />
        );
      case "AiOutlineFileGif":
        return (
          <AiOutlineFileGif
            style={{ display: message && "none" }}
            size={20}
            color="rgb(0, 132, 255)"
            className="icon"
          />
        );
      case "BsFillEmojiSmileFill":
        return (
          <BsFillEmojiSmileFill
            style={{ display: message && "none" }}
            size={20}
            color="rgb(0, 132, 255)"
            className="icon"
          />
        );

      default:
        return null;
    }
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

  function isJustNowFun(formattedTime: string) {
    const currentTime = new Date();
    const messageTime = new Date(formattedTime);

    // Calculate the time difference in milliseconds
    const timeDifference = currentTime.getTime() - messageTime.getTime();

    // Define the threshold in milliseconds (e.g., messages within the last minute)
    const threshold = 60 * 1000; // 1 minute

    return timeDifference < threshold;
  }
  function checkOnline() {
    const current_online_id = dataChat.onlineUsers?.map(
      (item, index) => item.user._id
    );
    if (dataChat.chatuser) {
      const online = current_online_id?.includes(dataChat.chatuser._id);
      console.log(
        "CHCKED ONLINE\n",
        current_online_id,
        "CURRENT\n",
        dataChat?.chatuser?._id,
        "ONLINE",
        online
      );
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
                    {Icon_switch(item)}
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
                  // if (isJustNowFun(item.sendAt)) {
                  //   isJustNow = true;
                  //   console.log("JUST NOW");
                  // }
                  if (index === displayMessage.length - 1) {
                    isJustNow = true;
                  }
                  return (
                    <MessageCard
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
                  {Icon_input_tools(item)}
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
};

export default React.memo(ChatBox);
