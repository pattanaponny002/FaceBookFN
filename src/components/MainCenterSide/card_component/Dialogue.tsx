import React, { Dispatch, Ref, useContext, useState } from "react";
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
import { flipOver } from "../../../motion";
import {
  uploadBytesResumable,
  ref as REF,
  getDownloadURL,
  StorageReference,
} from "firebase/storage";
import { storage } from "../../../firebase_config";
import { PostMessageApi } from "../../../assets/classes/post_api";
interface DialogueProps {
  user: userProps;
  toggle: boolean | undefined;
  Dispatch: Dispatch<Actions>;
  topic?: string;
  user_information?: userInformation;
}
interface testArrayProps {
  backdrop: string;
  profile: string;
}
const Dialogue = React.forwardRef(
  (
    { user, toggle, Dispatch, topic, user_information }: DialogueProps,
    ref: Ref<HTMLDivElement>
  ) => {
    const [profile, setProfile] = React.useState<string | undefined>(undefined);
    const [image_profile, setimage_profile] = React.useState<
      testArrayProps[] | undefined
    >([]);
    const [image_URL, setimage_URL] = React.useState<File | null>(null);
    const [text, settext] = React.useState("");

    const [isLoading, setisLoading] = React.useState<boolean>(false);

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
      const refStorage = REF(
        storage,
        "Potatoes/PostMessage/" + Date.now().toString()
      );
      if (user_information) {
        const postmessageApi = new PostMessageApi(
          url,
          refStorage,
          user_information,
          image_URL,
          text
        );

        const { result, CallbackPostMessage } =
          await postmessageApi.handlernewPost();
        if (result === true) {
          socket.emit("add_post_message", CallbackPostMessage);

          setTimeout(() => {
            setisLoading((prev) => isLoading);
            settext("");
            setimage_URL((prev) => null);
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
                    </div>
                  </div>
                  <div className="profile_option">
                    <AnimatePresence>
                      {image_URL && (
                        <m.div
                          onClick={() => setimage_URL((prev) => null)}
                          variants={flipOver}
                          initial="hidden"
                          animate={"show"}
                          exit={"removed"}
                          transition={{ duration: 0.5 }}
                          className="previewImage"
                        >
                          <img
                            className="img_post"
                            src={URL.createObjectURL(image_URL)}
                            alt=""
                          />
                        </m.div>
                      )}
                    </AnimatePresence>
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
                      <input
                        type="file"
                        id="dialogue_input"
                        onChange={(e) =>
                          setimage_URL((prev) =>
                            e.target.files ? e?.target?.files?.[0] : null
                          )
                        }
                      />
                      <div className="option_tools">
                        <label
                          className="wrapper_icon"
                          htmlFor="dialogue_input"
                        >
                          <img
                            src={dialogue_tools[0]}
                            loading="lazy"
                            className="icon"
                            alt=""
                          />
                        </label>
                        {dialogue_tools &&
                          dialogue_tools.slice(1, 5).map((item, index) => (
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
  }
);

export default React.memo(Dialogue);
