import React, { ChangeEvent, useContext, useState } from "react";
import { testArray } from "../../../assets/piscum_and_avatar";
import checklist from "../../../assets/tools/checklist.png";
import { TbShare3 } from "react-icons/tb";
import { SlOptions } from "react-icons/sl";
import { BsCameraVideoFill, BsFillEmojiSmileFill } from "react-icons/bs";
import { BsDashLg } from "react-icons/bs";
import { IoMdCall, IoMdSend } from "react-icons/io";
import {
  AiFillPlusCircle,
  AiFillFileImage,
  AiOutlineFileGif,
} from "react-icons/ai";
import { AnimatePresence } from "framer-motion";
import { motion as m } from "framer-motion";
import { drop_down, animate_translateY } from "../../../motion";
import { DisplayMessageProps } from "./DialoguePost";
import "../../../STYLES/Home/component/MediumPostcard/MediumPostCad.css";
import { userContextApi } from "../../../contextAPI/UserContextProvider";
import { userInformation } from "../../../contextAPI/UserContextProvider";
import Axios from "axios";
import { CircularProgress } from "@mui/material";
import { ref } from "firebase/storage";
import { icon_input_tools } from "../../UTIL_KEEP_STUFF";
import { Icon_input_tools_mp } from "../../UTIL_KEEP_STUFF";
interface MediumPostCardProp {
  item: DisplayMessageProps;
  name?: string;
  callbackIsLoading: (loadingChat: boolean) => void;
  isLoadingChat: boolean;
}

interface DisplayRepliesProps {
  message_id: string;
  username: string;
  text: string;
  senderId: string;
  receiverId?: string;
  toReplies: string;
  sendAt: number;
  photoURL?: string;
}
const MediumPostCard = ({
  item,
  name = "DjRonB",
  callbackIsLoading,
  isLoadingChat,
}: MediumPostCardProp) => {
  const color_gr = "gray";
  const [isReplies, setisReplies] = React.useState(false);
  const [toggleSubReplies, settoggleSubReplies] =
    React.useState<boolean>(false);
  const [displayRepliesMessage, setdisplayRepliesMessage] = React.useState<
    DisplayRepliesProps[]
  >([]);
  const refChat = React.useRef<HTMLDivElement>(null);
  const refSubMedium = React.useRef<HTMLDivElement>(null);
  const refInputMedium = React.useRef<HTMLFormElement>(null);
  const [repliedText, setrepliedText] = React.useState<string>("");
  const { user_information } = useContext(userContextApi);
  const [repliedTo, setrepliedTo] = React.useState<string>(item.username);
  const [isLoading, setisLoading] = React.useState<boolean>(false);

  function convertTime(time: number) {
    const currentTime = Date.now();

    const threshold = 60 * 1000;

    const difference = currentTime - time;
    if (difference <= threshold) {
      return "Just now";
    }
    return new Date(currentTime).toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
  }
  const [userMedium, setuserMedium] = React.useState<userInformation>();
  function close(e: MouseEvent) {
    !refInputMedium.current?.contains(e.target as Node) && setisReplies(false);
  }
  //// close
  React.useEffect(() => {
    document.addEventListener("mousedown", close);

    return () => {
      document.removeEventListener("mousedown", close);
    };
  }, []);
  async function fetchPostUser() {
    if (item?.senderId) {
      const url =
        process.env.REACT_APP_PORT + `/user/api/findByID/${item.senderId}`;

      const response = await Axios(url, { method: "get" });

      if (response.status === 200) {
        const message = response.data.message;
        const user = response.data.result;
        console.log("POST", item.senderId);
        setuserMedium((prev) => user);
      }
    }
  }
  async function sendReplies(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    if (item._id) {
      callbackIsLoading(true);
      const data: DisplayRepliesProps = {
        message_id: item._id,
        username: user_information.username,
        text: repliedText,
        senderId: user_information._id,
        photoURL: user_information.photoURL,
        toReplies: repliedTo,
        sendAt: new Date().getTime(),
      };

      const url = process.env.REACT_APP_PORT + "/repliedchat_post/api/add";
      const response = await Axios(url, {
        method: "post",
        data,
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        const arraivalMessage = response.data.result;
        console.log("arraivalMessage", arraivalMessage);
        setdisplayRepliesMessage((prev) => [...prev, arraivalMessage]);
        setrepliedText((prev) => "");
        setTimeout(() => {
          settoggleSubReplies((prev) => false);
          callbackIsLoading(false);
        }, 500);
      }
    }
  }
  async function fetchMeidiumMessage() {
    if (user_information && item._id) {
      console.log("FETCH MEDIUM ", item._id);
      const url =
        process.env.REACT_APP_PORT + "/repliedchat_post/api/" + item._id;

      const response = await Axios(url, {
        method: "get",
      });

      if (response.status === 200) {
        const arraivalMessage = response.data.result;
        console.log("Start FETCH MEDIUM", arraivalMessage);

        setdisplayRepliesMessage((prev) => [...arraivalMessage]);
      }
    }
  }
  React.useEffect(() => {
    if (!userMedium) {
      fetchPostUser();
    }
    if (item._id) {
      fetchMeidiumMessage();
    }
    refChat.current?.scrollIntoView({ behavior: "smooth" });
    return () => {};
  }, []);
  React.useEffect(() => {
    refSubMedium.current?.scrollIntoView({ behavior: "smooth" });
    return () => {};
  }, []);
  return (
    <div className="sub_container_message" ref={refChat}>
      <div className="section_image_and_message">
        <div className="wrapper_image">
          <img src={item?.photoURL} alt="" />
        </div>
        <div className="container_description">
          <span className="message_card">
            <span className="name">
              {item?.username} <img src={checklist} alt="" />
            </span>
            <span className="message">{item.text}</span>
          </span>
          <div className="container_replies">
            <span className="tool">Like</span>
            <span
              className="tool"
              onClick={() => {
                if (userMedium) {
                  setrepliedTo((prev) => userMedium?.username);
                  setisReplies((prev) => true);
                }
              }}
            >
              Reply
            </span>
            <span className="tool time">{convertTime(item.sendAt)}</span>
          </div>
        </div>
      </div>

      {displayRepliesMessage.length !== 0 && (
        <span
          className="comment"
          onClick={() => settoggleSubReplies((prev) => !prev)}
        >
          more comment {displayRepliesMessage.length}
        </span>
      )}
      {toggleSubReplies && (
        <div className="section_sub_replies_comment">
          {Array.isArray(displayRepliesMessage) &&
            displayRepliesMessage &&
            displayRepliesMessage
              .sort((a, b) => b?.sendAt - a?.sendAt)
              .map((textreplies, index) => (
                <div className="card" ref={refSubMedium}>
                  <span className="message_card">
                    <div className="sub_wrapper_image">
                      <img src={textreplies.photoURL} alt="" />
                    </div>
                    <span className="name">
                      {textreplies.username} <img src={checklist} alt="" />
                    </span>

                    <div className="message">
                      <span className="wrapper_message">
                        <h4 className="text_h4">
                          <span
                            className="underline_at"
                            style={{ color: "rgb(0, 132, 255)" }}
                          >
                            {"@" + textreplies.toReplies + "  "}
                          </span>
                          <span className="text">{textreplies.text}</span>
                        </h4>
                      </span>
                    </div>
                  </span>
                  <div className="container_replies">
                    <span className="tool">Like</span>
                    <span
                      className="tool"
                      onClick={() => {
                        setrepliedTo((prev) => textreplies.username);
                        setisReplies((prev) => true);
                      }}
                    >
                      Reply
                    </span>
                    <span className="tool time">
                      {convertTime(textreplies.sendAt)}
                    </span>
                  </div>
                </div>
              ))}
        </div>
      )}
      {/* sub comment */}
      <AnimatePresence>
        {isReplies && (
          <m.form
            ref={refInputMedium}
            className="section_sub_comment"
            variants={animate_translateY}
            initial={"hidden"}
            animate="show"
            exit={"removed"}
            transition={{ duration: 0.5, easings: ["easeInOut"] }}
            onSubmit={sendReplies}
          >
            <div className="wrapper_image">
              <img
                src={
                  user_information.photoURL
                    ? user_information.photoURL
                    : testArray[0].profile
                }
                alt=""
              />
            </div>
            <div className="sub_container_tools">
              <textarea
                className="textarea_replies"
                value={repliedText}
                autoFocus={true}
                placeholder="@write what you are thinking..."
                onChange={(e) => setrepliedText(e.target.value)}
              />

              <div className="container_input_tools">
                {icon_input_tools &&
                  icon_input_tools.map((item, index) => (
                    <span key={index} className="wrapper_icon_tools">
                      {Icon_input_tools_mp(item)}
                    </span>
                  ))}

                <span className="To">To:</span>
                <span className="replieTo">@{repliedTo}@@</span>
                {repliedText && (
                  <button type="submit" className="sub_send">
                    <IoMdSend size={20} />
                  </button>
                )}
              </div>
            </div>
          </m.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MediumPostCard;
