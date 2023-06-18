import React, { useState } from "react";
import { SlOptions } from "react-icons/sl";
import { GrClose } from "react-icons/gr";
import { AiOutlineLike } from "react-icons/ai";
import { TbShare3 } from "react-icons/tb";
import { GoComment } from "react-icons/go";
import { emoji, textContext, emoji_2 } from "../../../assets/slider_utils";
import "../../../STYLES/Home/component/PostCard/PostCard.css";
import { testArray } from "../../../assets/piscum_and_avatar";
import {
  PostContextApi,
  PostMessage,
} from "../../../contextAPI/PostContextProvider";
import {
  userContextApi,
  userInformation,
  userProps,
} from "../../../contextAPI/UserContextProvider";
import { drop_down, animate_translateY_reverse } from "../../../motion";
import Axios from "axios";
import Skeleton from "../skeleton/Skeleton";
import { REDUCER_USER } from "../../../reducers_utils/reducer_user";
import { AnimatePresence, motion as m } from "framer-motion";
import { REDUCER_DIALOGUE_POST_MESSAGE } from "../../../reducers_utils/reducer_dialogue_post";
import { lstat } from "fs";
import { chooseSentiment } from "../../UTIL_KEEP_STUFF";
import { MainContextApi } from "../../../contextAPI/MainContextProvider";
import { REDUCER_CURRENT_MAIN } from "../../../reducers_utils/reducer_mainuser";
import { useNavigate } from "react-router-dom";
interface PostCardProps {
  amount?: number;
  size?: number;
  bigsize?: boolean;
  width?: number;
  height?: number;
  percentage?: number;
  post_item?: PostMessage;
  fontSize?: number;
}
interface Sentiments {
  like: number;
  love: number;
  hug: number;
  laughing: number;
  funny: number;
  greedy: number;
  cool: number;
  angry: number;
  sad: number;
  _id: string;
}
interface DataSentiments {
  _id: string;
  post_id: string;
  username: string;
  reactions: { [key: string]: number };
}

interface DataProps {
  backdrop: string;
  profile: string;
}

interface Comment_Bar {
  sentiments: number;
  comments: number;
  share: number;
}
interface SentimentActive {
  image: string | undefined;
  color: string | undefined;
  text: string | undefined;
}

interface getListSentiment {
  username: string;
  reactions: string | undefined;
}
const Postcard = ({
  amount = 5,
  size = 300,
  bigsize = true,
  width = 550,
  height = 600,
  percentage,
  post_item,
  fontSize = 0.8,
}: PostCardProps) => {
  const random = Math.round(Math.random() * amount + 1);
  const { user, Dispatch, user_information } = React.useContext(userContextApi);
  const { post_message, Dispatch_Post } = React.useContext(PostContextApi);
  const { Dispatch_main } = React.useContext(MainContextApi);

  const [Data, setData] = React.useState<DataProps[]>();
  const [isLoading, setisLoading] = React.useState<boolean>(false);
  const [sentimentInformation, setSentimentInformation] =
    React.useState<DataSentiments[]>();
  const [listsentiment, setlistsentiment] =
    React.useState<getListSentiment[]>();
  const [amountComment, setAmountComments] = React.useState<Comment_Bar>({
    sentiments: 0,
    comments: 0,
    share: 0,
  });
  const [toggleSentiment, settoggleSentiment] = React.useState(false);
  const [toggleListSentiment, settoggleListSentiment] = React.useState(false);
  const [activesentiment, setactivesentiment] =
    React.useState<SentimentActive>();
  const [currentPostUser, setcurrentPostUser] =
    React.useState<userInformation>();

  async function fetchPostUser() {
    if (post_item?.senderId) {
      console.log("post_item", post_item);
      const url =
        process.env.REACT_APP_PORT + `/user/api/findByID/${post_item.senderId}`;
      const response = await Axios(url, { method: "get" });
      if (response.status === 200) {
        const message = response.data.message;
        const user = response.data.result;
        setcurrentPostUser((prev) => user);
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
    if (diffrent < threadshold) {
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

  function SetDiaLoguePost() {
    if (post_item) {
      Dispatch_Post({
        type: REDUCER_DIALOGUE_POST_MESSAGE.SET_POST_MESSAGE,
        payload: {
          ...post_item,
          photoURL: currentPostUser?.photoURL,
        },
      });
    }
  }

  async function FetchNumber() {
    const url = process.env.REACT_APP_PORT + `/chatpost/api/${post_item?._id}`;

    const response = await Axios(url, { method: "get" });

    if (response.status === 200) {
      const post: any[] = response.data.result;

      const amounts = post.length;

      /// AMOUNT OF COMMENT
      setAmountComments((prev) => ({ ...amountComment, comments: amounts }));
    }
  }

  async function handlerSentiment(text: string) {
    if (activesentiment && activesentiment.text) {
      console.log(text);
      const data = {
        post_id: post_item?._id,
        username: user_information.username,
        reactions: chooseSentiment(text.toLowerCase()), // not retrun immediately ??, instead it returned its prev state
      };
      console.log(data.reactions);
      const url = process.env.REACT_APP_PORT + "/emoji_sentiment/api/update";
      /// post fetch ==>

      const response = await Axios(url, {
        method: "post",
        data,
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200) {
        const message = response.data.message;
      }
    } else {
      const data = {
        post_id: post_item?._id,
        username: user_information.username,
        reactions: chooseSentiment(text.toLowerCase()), // not retrun immediately ??, instead it returned its prev state
      };
      const url = process.env.REACT_APP_PORT + "/emoji_sentiment/api/add";
      const response = await Axios(url, {
        method: "post",
        data,
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        const message = response.data.message;
        setAmountComments((prev) => ({
          ...prev,
          sentiments: prev.sentiments + 1,
        }));
      }
    }
  }
  async function handlerCancel() {
    const url =
      process.env.REACT_APP_PORT +
      "/emoji_sentiment/api/delete/" +
      post_item?._id;

    const response = await Axios(url, {
      method: "get",
    });
    if (response.status === 200) {
      const message = response.data.message;
      setAmountComments((prev) => ({
        ...prev,
        sentiments: prev.sentiments - 1,
      }));
    }
  }
  async function fetchSentiment() {
    const url =
      process.env.REACT_APP_PORT + "/emoji_sentiment/api/" + post_item?._id;
    const response = await Axios(url, {
      method: "get",
    });
    if (response.status === 200) {
      const message = response.data.message;
      //// AMOUNT OF  *** [LIKE ]*** // WRONG
      const result: DataSentiments[] = response.data.result;
      setAmountComments((prev) => ({
        ...prev,
        sentiments: result.length,
      }));
      setSentimentInformation((prev) => result);

      const find = result?.find(
        (sentiments) => sentiments.username === user_information.username
      );

      ///get emoji === 1 in the database
      const emoji_ICON =
        find &&
        Object.keys(find.reactions).find(
          (emoji) => find.reactions[emoji] === 1
        );
      //// gchoose
      const sentiment_emoji = emoji.find(
        (emode) => emode.text.toLowerCase() === emoji_ICON
      );

      /// LIKE EXIST ALREADY WITH USERNAME
      setactivesentiment((prev) => sentiment_emoji);
      ///find the list

      // LIST NUMBERS BLACK PLATE
      const list = result.map((item, index) => ({
        username: item.username,
        reactions: Object.keys(item.reactions).find(
          (key) => item.reactions[key] === 1
        ),
      }));
      list && setlistsentiment((prev) => list);
    }
  }
  function findEmojiImage(text: string) {
    const emoj_image = emoji.find(
      (checked) => checked.text.toLocaleLowerCase() === text
    );
    return emoj_image?.image;
  }
  React.useEffect(() => {
    if (post_item?.senderId && !currentPostUser) {
      fetchPostUser();
    }

    if (post_item?._id) {
      FetchNumber();
    }
    if (!Data) {
      setData((prev) => testArray);
      setTimeout(() => {
        setisLoading(true);
      }, 3500);
    }
    if (post_item?._id) {
      fetchSentiment();
    }
  }, []);
  const navigate = useNavigate();
  React.useEffect(() => {
    if (post_item?._id) {
      fetchSentiment();
    }
  }, [post_item?._id]);

  React.useEffect(() => {
    if (post_item?._id) {
      fetchPostUser();
    }
    return () => {};
  }, [post_item?._id]);
  const backdrop = React.useMemo(() => {
    return Data?.[Math.floor(Math.random() * 20)].backdrop;
  }, [Data]);
  const random_memo = React.useMemo(() => {
    return random.toFixed(1);
  }, []);
  /// undefine setPostItem adding dependent scss

  return (
    <AnimatePresence>
      {isLoading ? (
        <div
          onClick={SetDiaLoguePost}
          className="posting_user_container"
          style={{ width: `${percentage}%` }}
        >
          <div className="posting_section_user">
            <div className="sub_section">
              <div className="wrapper_user_profile">
                <img
                  loading="lazy"
                  src={
                    currentPostUser
                      ? currentPostUser.photoURL
                      : Data?.[0].profile ///
                  }
                  alt=""
                />
              </div>

              <div className="user_des">
                <span className="des_name">
                  {currentPostUser ? (
                    <span
                      className="profile_name"
                      onClick={() => {
                        Dispatch_main({
                          type: REDUCER_CURRENT_MAIN.SET_MAIN_CURRENT_USER,
                          payload: { ...currentPostUser }, // userInformation
                        });
                        navigate("/Main");
                      }}
                    >
                      {currentPostUser?.username}
                    </span>
                  ) : (
                    <span>DJON RB</span>
                  )}
                  <img
                    loading="lazy"
                    src={require("../../../assets/tools/checklist.png")}
                    alt=""
                  />
                </span>
                <span className="des_date">
                  {post_item && <span> {convertTime(post_item?.sendAt)}</span>}

                  <img
                    src={require("../../../assets/tools/cogwheel.png")}
                    alt=""
                    loading="lazy"
                  />
                </span>
              </div>
            </div>
            <div className="sub_section2">
              <div className="wrapper_tools">
                <SlOptions />
              </div>
              <div className="wrapper_tools">
                <GrClose />
              </div>
            </div>
          </div>
          {post_item?.text ? (
            <div className="posting_section_text">
              <span style={{ fontSize: `${fontSize}rem` }}>
                {post_item?.text}
              </span>
            </div>
          ) : (
            <div className="posting_section_text">{textContext}</div>
          )}
          {post_item?.photoURL ? (
            <div
              className="posting_section_image"
              style={{ padding: "0", height, width: "100%" }}
            >
              <div className="wrapper_images">
                <img
                  src={post_item?.photoURL}
                  loading="lazy"
                  style={{ objectFit: "cover", height, width: 650 }}
                />
              </div>
            </div>
          ) : (
            <div
              className="posting_section_image"
              style={{ padding: "1% 0 1% 0" }}
            >
              {Data &&
                Data.slice(0, 8).map((item, index) => (
                  <div
                    key={index}
                    className="wrapper_images"
                    style={{ width: 120, height: 120 }}
                  >
                    <img
                      src={item.profile}
                      loading="lazy"
                      style={{ width: 120, height: 120 }}
                    />
                  </div>
                ))}
            </div>
          )}
          <div className="posting_section_tools">
            <div className="container_tool_emoji">
              {emoji_2 &&
                emoji_2
                  .slice(0, 4)
                  .map((item, index) => (
                    <img
                      key={index + item.color}
                      className="emoji"
                      src={item.image}
                    />
                  ))}
            </div>
            <div className="container_like">
              <AnimatePresence>
                {toggleListSentiment && (
                  <m.div
                    onMouseEnter={() => settoggleListSentiment((prev) => true)}
                    onMouseLeave={() => settoggleListSentiment((prev) => false)}
                    className="list_sentiment"
                    variants={animate_translateY_reverse}
                    initial="hidden"
                    animate="show"
                    exit="removed"
                    onMouseOver={(e) => e.stopPropagation()}
                  >
                    {listsentiment &&
                      listsentiment?.map((item, index) => (
                        <div
                          key={index + item.username}
                          className="wrapper_list"
                        >
                          <span className="listname">{item.username}</span>
                          <span className="listname_reacttion">
                            {item.reactions}
                          </span>
                          {item.reactions && (
                            <span className="wrapper_image_emoji">
                              <img
                                src={findEmojiImage(item?.reactions)}
                                alt=""
                              />
                            </span>
                          )}
                        </div>
                      ))}
                  </m.div>
                )}
              </AnimatePresence>
              <span
                className="list_Detail"
                onMouseEnter={() => settoggleListSentiment((prev) => true)}
                onMouseLeave={() => settoggleListSentiment((prev) => false)}
              >
                like {amountComment.sentiments}{" "}
              </span>
              <span>comments {amountComment.comments}</span>
              <span>share {amountComment.share}</span>
            </div>
          </div>
          <div className="posting_section_chat">
            <div
              style={{
                borderColor: activesentiment && activesentiment?.color + "",
              }}
              className="wrapper_tools like"
              onMouseEnter={() => settoggleSentiment((prev) => true)}
              onMouseLeave={() => settoggleSentiment((prev) => false)}
            >
              {activesentiment ? (
                <AnimatePresence>
                  <m.span
                    onClick={() => {
                      handlerCancel();
                      setactivesentiment((prev) => undefined);
                    }}
                    variants={drop_down}
                    initial="hidden"
                    animate="show"
                    exit="removed"
                    transition={{ type: "spring" }}
                    className="wrapper_emoji_like"
                  >
                    <img
                      src={activesentiment.image}
                      alt="emoji"
                      className="emoji"
                    />
                  </m.span>
                  <m.span
                    variants={drop_down}
                    initial="hidden"
                    animate="show"
                    exit="removed"
                    key={"text"}
                    style={{ color: activesentiment.color + "" }}
                  >
                    {activesentiment && activesentiment.text}
                  </m.span>
                </AnimatePresence>
              ) : (
                <>
                  <span>Like</span>
                  <AiOutlineLike size={20} />
                </>
              )}
              {/* error */}
              <AnimatePresence>
                {toggleSentiment && (
                  <m.div
                    variants={animate_translateY_reverse}
                    initial="hidden"
                    animate="show"
                    exit={"removed"}
                    className="container_sentiment"
                  >
                    {emoji &&
                      emoji.map((item, index) => (
                        <m.span
                          key={55 + index}
                          variants={animate_translateY_reverse}
                          transition={{ delay: index * 0.1 }}
                          className="wrapper_emojij"
                          onClick={() => {
                            handlerSentiment(item.text);
                            setactivesentiment((prev) => ({
                              ...prev,
                              ...item,
                            }));
                          }}
                        >
                          <img className="emoji" src={item.image} />
                        </m.span>
                      ))}
                  </m.div>
                )}
              </AnimatePresence>
            </div>

            <div
              className="wrapper_tools"
              onClick={() => {
                Dispatch({
                  type: REDUCER_USER.TOGGLE_DIALOGURE_POST,
                  payload: {
                    ...user,
                    toggle_dialogue_post: !user.toggle_dialogue_post,
                  },
                });
              }}
            >
              Comment <GoComment size={20} />
            </div>
            <div className="wrapper_tools">
              Share <TbShare3 size={20} />
            </div>
          </div>
        </div>
      ) : (
        <Skeleton percentage={percentage} />
      )}
    </AnimatePresence>
  );
};

export default React.memo(Postcard);
