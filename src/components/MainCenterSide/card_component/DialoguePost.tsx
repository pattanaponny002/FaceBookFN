import React, { ChangeEvent, Dispatch, useState } from "react";

import "../../../STYLES/Home/component/DialoguePost/DialoguePost.css";
import { AnimatePresence, motion as m } from "framer-motion";
import {
  userInformation,
  Actions,
  userProps,
  userContextApi,
} from "../../../contextAPI/UserContextProvider";
import { AiOutlineClose, AiOutlineLike } from "react-icons/ai";
import { GoComment } from "react-icons/go";
import { TbShare3 } from "react-icons/tb";
import { SlOptions } from "react-icons/sl";
import { GrClose } from "react-icons/gr";
import CircularProgress from "@mui/material/CircularProgress";
import Postcard from "./Postcard";
import { testArray } from "../../../assets/piscum_and_avatar";
import cogwheel from "../../../assets/tools/cogwheel.png";
import checklist from "../../../assets/tools/checklist.png";
import { emoji } from "../../../assets/slider_utils";
import { IoMdCall, IoMdSend } from "react-icons/io";
import { BsCameraVideoFill, BsFillEmojiSmileFill } from "react-icons/bs";
import { BsDashLg } from "react-icons/bs";
import {
  AiFillPlusCircle,
  AiFillFileImage,
  AiOutlineFileGif,
} from "react-icons//ai";
import { BiMicrophone } from "react-icons/bi";
import { REDUCER_USER } from "../../../reducers_utils/reducer_user";
import {
  drop_down,
  animate_translateY,
  fadeIn_out,
  animate_translateY_reverse,
} from "../../../motion";
import Skeleton from "../skeleton/Skeleton";
import MediumPostCard from "./MediumPostCard";
import { PostContextApi } from "../../../contextAPI/PostContextProvider";
import Axios from "axios";
interface DialogueProps {
  user: userProps;
  toggle?: boolean | undefined;
  Dispatch: Dispatch<Actions>;
  ref: any;
  topic?: string;
  user_information?: userInformation;
}
export interface DisplayMessageProps {
  _id?: string;
  text: string;
  sendAt: number;

  photoURL?: string;
  senderId?: string;
  username: string;

  post_id: string;
  imageURL?: string[];
}
const DialoguePost = ({
  user,
  toggle,
  Dispatch,
  ref,
  topic,
}: DialogueProps) => {
  const [isLoading, setisLoading] = React.useState<boolean>(false);
  const [isLoadingChat, setisLoadingChat] = React.useState<boolean>(false);
  const [displayMessagePost, setdisplayMessagePost] = React.useState<
    DisplayMessageProps[]
  >([]);
  const { user_information } = React.useContext(userContextApi);
  const { post_message } = React.useContext(PostContextApi);
  const [userPost, setuserPost] = React.useState<userInformation>();
  const [text, setText] = React.useState<string>("");
  const icon_input_tools = [
    "AiFillPlusCircle",
    "AiFillFileImage",
    "AiOutlineFileGif",
    "BsFillEmojiSmileFill",
  ];

  const color_gr = "gray";
  const refDialogue = React.useRef<HTMLDivElement>(null);
  function Icon_input_tools(icon: string, size: number) {
    switch (icon) {
      case "AiFillPlusCircle":
        return (
          <AiFillPlusCircle
            size={size}
            // color="rgb(0, 132, 255)"
            color={color_gr}
            className="icon"
          />
        );
      case "AiFillFileImage":
        return (
          <AiFillFileImage
            // style={{ display: "" && "none" }}
            size={size}
            color={color_gr}
            className="icon"
          />
        );
      case "AiOutlineFileGif":
        return (
          <AiOutlineFileGif size={size} color={color_gr} className="icon" />
        );
      case "BsFillEmojiSmileFill":
        return (
          <BsFillEmojiSmileFill size={size} color={color_gr} className="icon" />
        );

      default:
        return null;
    }
  }
  function closeDialoguePost(e: React.MouseEvent<HTMLDivElement>) {
    if (!refDialogue.current?.contains(e.target as Node)) {
      Dispatch({
        type: REDUCER_USER.TOGGLE_DIALOGURE_POST,
        payload: {
          ...user,
          toggle_dialogue_post: false,
        },
      });
    }
  }

  async function onSendMessage(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    if (user_information && post_message._id) {
      callbackIsLoading(true);
      console.log("send_to_post_message_id", post_message._id);
      const messagePost: DisplayMessageProps = {
        post_id: post_message._id,
        username: user_information.username,
        text,
        senderId: user_information._id,
        sendAt: new Date().getTime(),
        photoURL: user_information?.photoURL,
      };

      const url = process.env.REACT_APP_PORT + "/chatpost/api/add";

      const response = await Axios(url, {
        method: "post",
        data: messagePost,
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        const arraivalMessage = response.data.result;
        setTimeout(() => {
          setdisplayMessagePost((prev) => [...prev, arraivalMessage]);
          callbackIsLoading(false);
          setText("");
        }, 500);
      }
    }
  }

  function convertTime(time: string) {
    //Jun 13, 9:20:01 PM

    const newTime = parseInt(time, 10);
    // console.log(newTime);

    const currentTime = Date.now();
    const threadshold = 60 * 1000;
    const diffrent = currentTime - newTime;
    if (diffrent <= threadshold) {
      // this wont happen 1686663279721 '----' 992438408000 '== ' 60 *1000 !== 694224871721 ?????
      return "just now";
    } else {
      return new Date(newTime).toLocaleString("en-US", {
        // day: "numeric",
        // month: "short",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      });
    }
  }
  async function fetchChatPost() {
    if (user_information && post_message._id) {
      console.log("FETCH ", post_message._id);
      const url =
        process.env.REACT_APP_PORT + "/chatpost/api/" + post_message._id;

      const response = await Axios(url, {
        method: "get",
      });

      if (response.status === 200) {
        const arraivalMessage = response.data.result;
        console.log("Start FETCH", arraivalMessage);

        setdisplayMessagePost((prev) => [...arraivalMessage]);
      }
    }
  }
  const callbackIsLoading = React.useCallback(
    (loadingChat: boolean) => {
      setisLoadingChat((prev) => loadingChat);
    },
    [isLoadingChat]
  );
  React.useEffect(() => {
    if (post_message._id) {
      fetchChatPost();
    }
    return () => {};
  }, [post_message._id]);
  async function fetchPostUser() {
    if (post_message?.senderId) {
      const url =
        process.env.REACT_APP_PORT +
        `/user/api/findByID/${post_message.senderId}`;

      const response = await Axios(url, { method: "get" });

      if (response.status === 200) {
        const message = response.data.message;
        const user = response.data.result;
        console.log("POST", post_message._id);
        setuserPost((prev) => user);
      }
    }
  }

  React.useEffect(() => {
    if (displayMessagePost.length === 0 && post_message._id) {
      fetchChatPost();
    }
    if (!userPost && post_message.senderId) {
      fetchPostUser();
    }
    setisLoading(true);

    let timeout = setTimeout(() => {
      setisLoading(false);
    }, 1500);

    return () => {
      clearTimeout(timeout);
    };
  }, [user.toggle_dialogue_post, post_message._id]);

  return (
    <AnimatePresence>
      {toggle && (
        <m.div
          variants={drop_down}
          exit={"removed"}
          className="dialogue_post"
          onClick={closeDialoguePost}
        >
          <div className="wrapper_close" onClick={closeDialoguePost}>
            <AiOutlineClose size={20} />
          </div>
          {!isLoading ? (
            <m.div
              ref={refDialogue}
              variants={fadeIn_out}
              initial="hidden"
              animate={"show"}
              exit={"removed"}
              className="container_post"
              transition={{ duration: 0.5 }}
            >
              {isLoadingChat && (
                <div className="loading_chat">
                  <CircularProgress />
                </div>
              )}
              <div className="postbar">
                <span>Profile :{post_message?._id}</span>
              </div>
              <div className="container_comment">
                <div className="container_profile">
                  <div className="wrapper_image">
                    <img
                      src={
                        userPost?.photoURL
                          ? userPost.photoURL
                          : testArray[0].profile
                      }
                      alt="monster"
                    />
                  </div>
                  <div className="container_introduction">
                    <div className="wrapper_desc">
                      <span>{userPost?.username}</span>
                      <img src={checklist} alt="master" />
                    </div>
                    <div className="wrapper_desc">
                      <span className="desc_date">
                        {convertTime(post_message.sendAt)}
                      </span>
                      <img src={cogwheel} alt="master" />
                    </div>
                  </div>
                  <div className="wrapper_option">
                    <SlOptions size={20} />
                  </div>
                </div>
                <div className="boxes">
                  <img src={testArray[0].backdrop} alt="" />
                </div>
                <div className="desc">
                  <div className="container_emoji">
                    {emoji &&
                      emoji.map((item, index) => (
                        <img
                          className="icon_emoji"
                          key={index}
                          src={item.image}
                        />
                      ))}
                  </div>

                  <div className="comment">
                    <span>Comments 1.4k</span>
                  </div>
                </div>
                <div className="desc">
                  <span className="tools">
                    <AiOutlineLike size={30} color="gray" /> Like
                  </span>
                  <span className="tools">
                    <GoComment size={30} color="gray" />
                    Comment
                  </span>
                  <span className="tools">
                    <TbShare3 size={30} color="gray" />
                    Share
                  </span>
                </div>
                <div className="container_message_comment">
                  <div className="template">
                    {displayMessagePost &&
                      displayMessagePost
                        .sort((a, b) => b.sendAt - a.sendAt)
                        .map((item, index) => (
                          <MediumPostCard
                            key={index}
                            item={item}
                            callbackIsLoading={callbackIsLoading}
                            isLoadingChat={isLoadingChat}
                          />
                        ))}
                  </div>
                </div>
              </div>
              <AnimatePresence>
                <m.div
                  variants={animate_translateY_reverse}
                  initial={"hidden"}
                  transition={{ duration: 1 }}
                  animate={"show"}
                  className="bottombar"
                >
                  <div className="subcontainer">
                    <div className="wrapper_image">
                      <img
                        src={
                          user_information?.photoURL
                            ? user_information.photoURL
                            : testArray[5].profile
                        }
                        alt="wrapper"
                      />
                    </div>
                    <form
                      className="wrapper_text_area"
                      onSubmit={onSendMessage}
                    >
                      <textarea
                        value={text}
                        autoFocus={true}
                        onChange={(e) => setText(e.target.value)}
                        className="textarea"
                        placeholder="@write what you are thinking..."
                      />
                      <div className="container_input_tools">
                        {icon_input_tools &&
                          icon_input_tools.map((item, index) => (
                            <span key={index} className="wrapper_icon_tools">
                              {Icon_input_tools(item, 25)}
                            </span>
                          ))}
                        {text && (
                          <button
                            type="submit"
                            className="wrapper_icon_tools last"
                          >
                            <IoMdSend size={25} />
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </m.div>
              </AnimatePresence>
            </m.div>
          ) : (
            <Skeleton percentage={70} height={600} />
          )}
        </m.div>
      )}
    </AnimatePresence>
  );
};

export default React.memo(DialoguePost);
