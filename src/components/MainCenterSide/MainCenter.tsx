import React, { useContext } from "react";
import "../../STYLES/Home/component/MainCenter/MainCenter.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper";
import "swiper/css/bundle"; // swiper css
import { BsBookFill } from "react-icons/bs";
import { ImVideoCamera } from "react-icons/im";
import {
  images_slider,
  textContext,
  tools,
  emoji,
} from "../../assets/slider_utils";
import { SlOptions } from "react-icons/sl";
import { GrClose } from "react-icons/gr";
import { AiOutlineLike } from "react-icons/ai";
import { TbShare3 } from "react-icons/tb";
import { GoComment } from "react-icons/go";
import Postcard from "./card_component/Postcard";
import {
  reducer_post,
  state_post,
  REDUCER_POST,
} from "../../reducers_utils/reducer_post";
import { userContextApi } from "../../contextAPI/UserContextProvider";
import { REDUCER_USER } from "../../reducers_utils/reducer_user";
import { testArray } from "../../assets/piscum_and_avatar";
import Axios from "axios";
import { socket } from "../../socket";
import { PostMessage } from "../../contextAPI/PostContextProvider";
interface DataProps {
  backdrop: string;
  profile: string;
}

export interface SocketPostMessage {
  _id: string;
  text: string;
  senderId: string;
  sendAt: string;
  photoURL?: string;
  createdAt: string;
}
const MainCenter = () => {
  // new Date().toLocaleString("en-US", {
  //   day: "numeric",
  //   month: "short",
  //   hour: "numeric",
  //   minute: "numeric",
  //   second: "numeric",
  // }),
  const { user, Dispatch, user_information } = useContext(userContextApi);

  const [Data, setData] = React.useState<DataProps[]>();
  const [displayPostMessage, setdisplayPostMessage] = React.useState<
    PostMessage[]
  >([]);
  React.useEffect(() => {
    if (!Data) {
      setData((prev) => testArray);
    }
  }, []);
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
  //// BUG 55555555555555555555555
  function socketGetPost(post: SocketPostMessage) {
    setdisplayPostMessage((prev) => [...prev, post]);
  }
  function FormattedTime(time: string) {
    const newTime = parseInt(time, 10);

    return newTime;
  }
  React.useEffect(() => {
    socket.on("get_post_message", socketGetPost);

    return () => {
      socket.off("get_post_message", socketGetPost);
    };
  }, [socket]);
  return (
    <div className="container_main_center">
      <div className="posting_container">
        <div className="container_stories">
          <span>
            <BsBookFill className="icon" size={25} />
            Books
          </span>
          <span>
            <ImVideoCamera className="icon" size={25} />
            Reels
          </span>
        </div>
        <Swiper
          className="container_slider_main"
          spaceBetween={10}
          slidesPerView={"auto"}
          autoplay
          loop={true}
          modules={[Autoplay]}
        >
          {Data &&
            Data.map((item, index) => (
              <SwiperSlide key={index} className="wrapper_card">
                <div className="card">
                  <img className="card_image" src={item.backdrop} alt="" />
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
      <div className="posting_message_container">
        <div className="posting_message_input">
          <div className="wrapper_posting">
            <img
              loading="lazy"
              className="image_posting"
              src={
                user_information.photoURL
                  ? user_information.photoURL
                  : "https://picsum.photos/200/300/"
              }
              alt=""
            />
          </div>
          <span
            className="searching_posting"
            onClick={() =>
              Dispatch({
                type: REDUCER_USER.TOGGLE_DIALOGURE,
                payload: { ...user, toggle_dialogue: !user.toggle_dialogue },
              })
            }
          >
            Searching.....
          </span>
        </div>
        <div className="posting_message_tools">
          {tools &&
            tools.map((item, index) => (
              <div key={index} className="posting_tool">
                <img
                  className="tool_image"
                  src={item?.image}
                  alt=""
                  loading="lazy"
                />
                {item?.name}
              </div>
            ))}
        </div>
      </div>
      {displayPostMessage &&
        displayPostMessage
          .sort((a, b) => FormattedTime(b.sendAt) - FormattedTime(a.sendAt))
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
                fontSize={fontsize}
                percentage={95}
                post_item={item}
              />
            );
          })}
    </div>
  );
};

export default MainCenter;
