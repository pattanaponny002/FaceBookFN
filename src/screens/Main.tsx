import React from "react";
import "../STYLES/Main/Main.css";
import { SlOptions } from "react-icons/sl";
import { tools } from "../assets/slider_utils";
import { AiFillSetting, AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { IoIosOptions } from "react-icons/io";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper";
import "swiper/css/bundle"; // swiper css
import Postcard from "../components/MainCenterSide/card_component/Postcard";
import {
  reducer_post,
  REDUCER_POST,
  state_post,
} from "../reducers_utils/reducer_post";
import { AnimatePresence } from "framer-motion";
import { motion as m } from "framer-motion";
import { userContextApi } from "../contextAPI/UserContextProvider";
import { REDUCER_USER } from "../reducers_utils/reducer_user";
import Dialogue from "../components/MainCenterSide/card_component/Dialogue";
import { piscum, avatar } from "../assets/piscum_and_avatar";
import {
  testArray_slider,
  gallery_slider,
  testArray,
} from "../assets/piscum_and_avatar";
import { MainContextApi } from "../contextAPI/MainContextProvider";
import { REDUCER_CURRENT_MAIN } from "../reducers_utils/reducer_mainuser";
import Axios from "axios";
import { SlUserFollow, SlUserUnfollow } from "react-icons/sl";
import { GrInProgress } from "react-icons/gr";
import messenger from "../assets/logos/fb_messager.png";
import checklist from "../assets/logos/checklist.png";
import { ChatBoxContextApi } from "../contextAPI/ChatBoxContextProvider";
import { REDUCER_CHATBOX } from "../reducers_utils/reducer_chatbox";
import { socket } from "../socket";
import { PostMessage } from "../contextAPI/PostContextProvider";
import { CircularProgress } from "@mui/material";
interface slider {
  backdrop: string;
  profile: string;
}
interface DataPRops {
  testArray_slider: slider[];
  gallery_slider: slider[];
  testArray: any[];
}

export interface MembersProps {
  _id: string;
  members: string[];
  createAt: string;
  updatedAt: string;
}
const Main = () => {
  const bg = require("../assets/bg/natural-scenic-li-countryside-bamboo-outdoors.jpg");

  const random = Math.round(Math.random() * 1 + 5);

  const [Data, setData] = React.useState<DataPRops>();
  const ref_dialogue = React.useRef<HTMLDivElement>(null);
  const { user, Dispatch, user_information } = React.useContext(userContextApi);
  const { current_user, Dispatch_main } = React.useContext(MainContextApi);

  const { dataChat, Dispatch_chatbox } = React.useContext(ChatBoxContextApi);
  const [isLoading, setisLoading] = React.useState<boolean>(false);

  const [addingFriend, setaddingFriend] = React.useState<boolean>(false);
  const [followingMember, setfollowingMember] = React.useState<MembersProps[]>(
    []
  );
  const [displayPostMessage, setdisplayPostMessage] = React.useState<
    PostMessage[]
  >([]);
  const FriendCircles = React.useMemo(() => {
    return Data?.testArray_slider;
  }, [Data?.testArray_slider]);
  React.useEffect(() => {
    if (!Data?.gallery_slider || !Data?.testArray_slider || !Data?.testArray) {
      setData((prev) => ({
        ...prev,
        testArray_slider,
        gallery_slider,
        testArray,
      }));
    }
  }, []);
  async function handlerFollowFriend(
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) {
    if (current_user._id !== user_information._id) {
      setisLoading(true);
      const url = process.env.REACT_APP_PORT + "/friend/api/add";
      const data = {
        senderId: user_information._id,
        receiverId: current_user._id,
      };
      const response = await Axios(url, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        data,
      });

      const message = response.data.message;
      if (response.status === 200) {
        fetchFollowingFreind();
        setTimeout(() => {
          setisLoading(false);
        }, 1500);
      } else {
        alert("Failed..!!");
      }
    } else {
      alert("your self");
      return;
    }
  }

  async function handlerUnFollowFriend() {
    setisLoading(true);
    const url = process.env.REACT_APP_PORT + "/friend/api/delete";
    const data = {
      senderId: user_information._id,
      receiverId: current_user._id,
    };
    const response = await Axios(url, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      data,
    });

    const message = response.data.message;

    if (response.status === 200) {
      fetchFollowingFreind();
      setTimeout(() => {
        setisLoading(false);
      }, 1500);
    } else {
      alert("Failed..!!");
    }
  }
  async function addConversation(e: React.MouseEvent<HTMLLIElement>) {
    e.stopPropagation();
    // addConversation();

    // ToggleDown
    if (current_user) {
      Dispatch({
        type: REDUCER_USER.TOGGLE_CHATBOX,
        payload: { ...user, toggle_chat_box: true },
      });

      const data = {
        senderId: user_information._id,
        receiverId: current_user._id,
      };
      const url = process.env.REACT_APP_PORT + "/conversation/api/add";
      const response = await Axios(url, {
        method: "post",
        data,
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        socket.emit("join_room", dataChat);
        const result = response.data.result;

        ///find not findOne for checking so we would like to add [0]
        console.log("id", result[0]._id);
        Dispatch_chatbox({
          type: REDUCER_CHATBOX.SET_CURRENT_CHATBOX,
          payload: {
            dataChat: {
              ...dataChat,
              chatuser: current_user,
              conversationId: result[0]._id,
            },
          },
        });
      }
    }
  }

  function verifyFriend(members: MembersProps[]) {
    /// not current member
    const Follofriend = members.some((item) =>
      item.members.includes(current_user._id)
    );
    console.log("VERIFIED", Follofriend);
    setaddingFriend((prev) => Follofriend); // true or false
    //
  }
  async function fetchFollowingFreind() {
    const url =
      process.env.REACT_APP_PORT + "/friend/api/fetch/" + user_information._id;
    const response = await Axios(url, { method: "get" });

    if (response.status === 200) {
      const members = response.data.result;
      setfollowingMember((prev) => members);
      verifyFriend(members);
    }
  }

  async function fetchPostMessage() {
    const url = process.env.REACT_APP_PORT + "/post_message/api/fetch";

    const response = await Axios(url, { method: "get" });

    if (response.status === 200) {
      const message = response.data.message;
      const posts = response.data.result;
      setdisplayPostMessage((prev) => posts);
    } else {
      const error = response.data.err;
      alert(error);
      const message = response.data.message;
    }
  }
  React.useEffect(() => {
    if (displayPostMessage.length === 0) {
      fetchPostMessage();
    }
    return () => {};
  }, []);
  React.useEffect(() => {
    current_user && fetchFollowingFreind();
    return () => {
      // alert("fetch");
    };
  }, [current_user]);
  function FormattedTime(time: string) {
    return new Date(time).getTime();
  }
  return (
    <div className="container_main_content">
      <Dialogue
        topic="main"
        toggle={user.toggle_dialogue_main}
        user={user}
        Dispatch={Dispatch}
        user_information={user_information}
      />

      <div className="profile_introduction">
        <div className="section1">
          <img src={piscum[15]} alt="" />
        </div>
        <div className="section2">
          <div className="container">
            <div className="box1">
              <div className="wrapper_image_profile">
                <img
                  src={
                    current_user.photoURL
                      ? current_user.photoURL
                      : Data?.testArray_slider[0].profile
                  }
                  alt=""
                />
              </div>
            </div>
            <div className="box2">
              <span className="name">
                Wongsarakit Pattanapon (王若奇) {current_user.username}
              </span>
              <span className="friend">Friend 203</span>
              <div className="container_friend_image">
                {FriendCircles &&
                  FriendCircles.slice(0, 6).map((item, index) => (
                    <div
                      key={index}
                      className="wrapper_profile"
                      style={{ left: `${index * 30}px` }}
                    >
                      <img src={item.profile} alt="" />
                    </div>
                  ))}
              </div>
            </div>
            <div className="box3">
              <div className="container_tools">
                <div className="container_tool_section1">
                  {user_information._id !== current_user._id ? (
                    <>
                      {addingFriend ? (
                        <span
                          className="button"
                          onClick={handlerUnFollowFriend}
                        >
                          {!isLoading ? (
                            <SlUserUnfollow size={20} />
                          ) : (
                            <CircularProgress size={20} color={"inherit"} />
                          )}
                          Unfollow
                        </span>
                      ) : (
                        <span className="button" onClick={handlerFollowFriend}>
                          {!isLoading ? (
                            <SlUserFollow size={20} />
                          ) : (
                            <CircularProgress size={20} color={"inherit"} />
                          )}
                          Follow
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      <span className="button">you self</span>
                    </>
                  )}
                  {user_information._id !== current_user._id ? (
                    <span className="button2" onClick={addConversation}>
                      <img src={messenger} alt="" />
                      messager
                    </span>
                  ) : (
                    <span className="button2">
                      <img src={checklist} alt="" />
                      Record
                    </span>
                  )}
                </div>
                <span className="option">
                  <AiFillCaretDown size={20} />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="section3">
          <div className="container_options">
            <div className="tools">
              <span>Post</span>
              <span>Relavant</span>
              <span>Friend</span>
              <span>Picture</span>
              <span>Video</span>
              <span>More</span>
            </div>
            <div className="option">
              <span className="wrapper_icon">
                <SlOptions size={20} />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="section_content">
        <div className="container_content_main">
          <div className="introduction_section">
            <div className="introduction_card">
              <div className="header">
                <span>Info Myself</span>
              </div>
              <div className="introduction_option">
                <span className="option">Description</span>
                <span className="option">Detail</span>
                <span className="option">Hobby</span>
              </div>
              <Swiper
                className="container_slider_main"
                spaceBetween={15}
                slidesPerView={3}
                autoplay
                loop={true}
                modules={[Autoplay]}
              >
                {Data?.testArray_slider &&
                  Data?.testArray_slider.map((item, index) => (
                    <SwiperSlide key={index} className="wrapper_card">
                      <div className="card">
                        <img
                          className="card_image"
                          src={item.backdrop}
                          alt=""
                        />
                      </div>
                      <span className="card_profile_owner">
                        <img
                          className="card_profile_owner_image"
                          src={item.profile}
                          alt=""
                        />
                      </span>
                    </SwiperSlide>
                  ))}
              </Swiper>
            </div>

            <div className="gallery_card">
              <div className="gallery_header">
                <span>Picture</span>
                <span className="all_picture">All pictures</span>
              </div>
              <div className="gallery_container">
                {Data?.gallery_slider &&
                  Data?.gallery_slider
                    .slice(0, 9)
                    // .sort(() => Math.random() - 0.5)
                    .map((item, index) => (
                      <div key={index} className="wrapper">
                        <img
                          src={item.profile}
                          className="gallery_image"
                          alt=""
                        />
                        <div className="backdrop" />
                      </div>
                    ))}
              </div>
            </div>
            <div className="friend_card">
              <div className="friend_header">
                <span>Friend</span>
                <span className="all_picture">All Friend</span>
              </div>
              <div className="friend_container">
                {Data?.gallery_slider &&
                  Data?.gallery_slider.slice(0, 12).map((item, index) => (
                    <div key={index} className="wrapper">
                      <img src={item.profile} className="friend_image" alt="" />
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="post_section">
            <div className="posting_message_container">
              <div className="posting_message_input">
                <div className="wrapper_posting">
                  <img
                    className="image_posting"
                    src={user_information.photoURL}
                    alt=""
                  />
                </div>
                <span
                  className="searching_posting"
                  onMouseDown={() =>
                    Dispatch({
                      type: REDUCER_USER.TOGGLE_DIALOGURE_MAIN,
                      payload: {
                        ...user,
                        toggle_dialogue_main: !user.toggle_dialogue_main,
                      },
                    })
                  }
                >
                  Searching.....
                  {user.toggle_dialogue_main ? "master" : "toggle"}
                </span>
              </div>
              <div className="posting_message_tools">
                {tools &&
                  tools.map((item, index) => (
                    <div key={index} className="posting_tool">
                      <img className="tool_image" src={item?.image} alt="" />
                      {item?.name}
                    </div>
                  ))}
              </div>
            </div>
            <div className="posting_dd_input">
              <div className="section_first_dd">
                <span className="post_header">Post</span>
                <div className="tools">
                  <span className="tool">
                    <AiFillSetting />
                    <div>master</div>
                  </span>
                  <span className="tool">
                    <IoIosOptions />
                    <div>master</div>
                  </span>
                </div>
              </div>
              <div className="section_second_dd">
                <span className="view">List View</span>
                <span className="view">Table View</span>
              </div>
            </div>
            {displayPostMessage &&
              displayPostMessage
                .filter(
                  (checked, index) => checked.senderId === current_user._id
                )
                .sort(
                  (a, b) => FormattedTime(b.sendAt) - FormattedTime(a.sendAt)
                )
                .map((item, index) => {
                  let fontsize: number;
                  if (item.text.length > 150) {
                    fontsize = 0.8;
                  } else {
                    fontsize = 1.5;
                  }
                  return (
                    <Postcard
                      bigsize={index % 2 === 0 ? true : false}
                      size={300}
                      height={600}
                      width={550}
                      percentage={100}
                      post_item={item}
                      fontSize={fontsize}
                    />
                  );
                })}
            <Postcard percentage={100} />
            <Postcard
              bigsize
              size={300}
              width={550}
              height={600}
              percentage={100}
            />
            <Postcard percentage={100} />
            <Postcard
              bigsize
              size={300}
              width={550}
              height={600}
              percentage={100}
            />
            <Postcard percentage={100} />
            <Postcard
              bigsize
              size={300}
              width={500}
              height={600}
              percentage={100}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
