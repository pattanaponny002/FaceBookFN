import React, { Dispatch, useContext, useState } from "react";
import { AnimatePresence } from "framer-motion";
import "../../../STYLES/Home/component/Dialogue/Dialogue.css";
import { motion as m } from "framer-motion";

import {
  Actions,
  userContextApi,
  userProps,
} from "../../../contextAPI/UserContextProvider";
import { REDUCER_USER } from "../../../reducers_utils/reducer_user";
import { BsGlobeAsiaAustralia } from "react-icons/bs";
import { IoIosClose } from "react-icons/io";
import { AiFillCaretDown } from "react-icons/ai";
import { dialogue_adding, dialogue_tools } from "../../../assets/drawer_util";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper";
import { testArray, avatar } from "../../../assets/piscum_and_avatar";
import "swiper/css/bundle"; // swiper css
import { userInformation } from "../../../contextAPI/UserContextProvider";
import Axios from "axios";
import { socket } from "../../../socket";
import CircularProgress from "@mui/material/CircularProgress";
interface DialogueProps {
  user: userProps;
  toggle: boolean | undefined;
  Dispatch: Dispatch<Actions>;
  ref: any;
  topic?: string;
  user_information?: userInformation;
}
interface testArrayProps {
  backdrop: string;
  profile: string;
}
const Dialogue = ({
  user,
  toggle,
  Dispatch,
  ref,
  topic,
  user_information,
}: DialogueProps) => {
  const [profile, setProfile] = React.useState<string | undefined>(undefined);
  const [image_profile, setimage_profile] = React.useState<
    testArrayProps[] | undefined
  >([]);

  const [text, settext] = React.useState("");

  const [isLoading, setisLoading] = React.useState<boolean>(false);
  // const gallery_slider = new Array(12).fill(0).map(() => ({
  //   image_number: `https://picsum.photos/id/${Math.round(
  //     Math.random() * 150
  //   )}/${100}/${100}`,
  //   profile: `https://i.pravatar.cc/120?img=${Math.random() * 10}`,
  // }));
  function closeDislogue() {
    if (topic === "main") {
      Dispatch({
        type: REDUCER_USER.TOGGLE_DIALOGURE_MAIN,
        payload: {
          ...user,
          toggle_dialogue_main: !user.toggle_dialogue_main,
        },
      });
    } else {
      Dispatch({
        type: REDUCER_USER.TOGGLE_DIALOGURE,
        payload: {
          ...user,
          toggle_dialogue: !user.toggle_dialogue,
        },
      });
    }
  }
  async function handlerNewPost() {
    setisLoading((prev) => true);
    const url = process.env.REACT_APP_PORT + "/post_message/api/add";
    const data = {
      senderId: user_information?._id,
      text,
      photoURL: user_information?.photoURL,
      sendAt: Date.now(),
    };
    const response = await Axios(url, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      data,
    });

    if (response.status === 200) {
      socket.emit("add_post_message", data);

      setTimeout(() => {
        setisLoading((prev) => isLoading);
        settext("");
        if (topic === "main") {
          Dispatch({
            type: REDUCER_USER.TOGGLE_DIALOGURE_MAIN,
            payload: { ...user, toggle_dialogue_main: !toggle },
          });
        } else {
          Dispatch({
            type: REDUCER_USER.TOGGLE_DIALOGURE,
            payload: { ...user, toggle_dialogue: !toggle },
          });
        }
      }, 3000);
    }
  }
  React.useEffect(() => {
    if (!profile) {
      setProfile((prev) => avatar[Math.floor(Math.random() * avatar.length)]);
      setimage_profile((prev) => testArray);
    }

    return () => {};
  }, []);
  return (
    <AnimatePresence>
      {toggle && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="dialogure"
          onMouseDown={closeDislogue}
        >
          <AnimatePresence>
            {isLoading && (
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="container_loading"
              >
                <CircularProgress />
              </m.div>
            )}
          </AnimatePresence>
          {/* how to prevent propogation click */}
          <AnimatePresence>
            <m.div
              ref={ref}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                easings: ["easeInOut"],
              }}
              className="dialogue_card"
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
            >
              <div className="dialogue_header">
                <div className="subcontainer_header">
                  <span className="header">Creat Post</span>
                  <span className="icon_close" onMouseDown={closeDislogue}>
                    <IoIosClose size={40} className="icon" />
                  </span>
                </div>
              </div>
              <div className="dialogue_posting_content">
                <div className="profile">
                  <div className="wrapper">
                    <img
                      src={user_information?.photoURL}
                      loading="lazy"
                      className="image_profile"
                    />
                  </div>
                  <div className="profile_desc">
                    <span className="name">{user_information?.username}</span>
                    <span className="button">
                      <BsGlobeAsiaAustralia size={15} />
                      <span>public</span>
                      <AiFillCaretDown size={15} />
                    </span>
                  </div>
                </div>
                <div className="profile_input">
                  <div className="container_input">
                    <textarea
                      autoFocus={true}
                      value={text}
                      placeholder="What do you think..."
                      onChange={(e) => settext((prev) => e.target.value)}
                    />
                    {/* <Swiper
                      className="container_image_input"
                      slidesPerView={5}
                      spaceBetween={10}
                      autoplay
                      loop={true}
                      modules={[Autoplay]}
                    >
                      {image_profile &&
                        image_profile.map((item, index) => (
                          <SwiperSlide key={index} className="wrapper_image">
                            <img
                              className="image_input"
                              src={item.image_number}
                              alt=""
                            />
                          </SwiperSlide>
                        ))}
                    </Swiper> */}
                  </div>
                </div>
                <div className="profile_option">
                  <div className="container_option_tools">
                    {dialogue_adding &&
                      dialogue_adding.map((item, index) => (
                        <div className="wrapper_icon" key={index}>
                          <img src={item} loading="lazy" className="icon" />
                        </div>
                      ))}
                  </div>
                </div>
                <div className="profile_option_tools">
                  <div className="container_option_tools">
                    <span className="adding">Add your post</span>
                    <div className="option_tools">
                      {dialogue_tools &&
                        dialogue_tools.map((item, index) => (
                          <div className="wrapper_icon" key={index}>
                            <img
                              src={item}
                              loading="lazy"
                              className="icon"
                              alt=""
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
                <div className="profile_button">
                  <button
                    onClick={handlerNewPost}
                    className="button_post"
                    disabled={text ? false : true}
                  >
                    <span>Post</span>
                  </button>
                </div>
              </div>
            </m.div>
          </AnimatePresence>
        </m.div>
      )}
    </AnimatePresence>
  );
};

export default React.memo(Dialogue);
