import React, {
  ChangeEvent,
  useContext,
  useReducer,
  useRef,
  useState,
} from "react";
import "../STYLES/NavBar/NavBar.css";
import {
  AiOutlineMenu,
  AiFillMessage,
  AiOutlineSearch,
  AiOutlinePlus,
  AiOutlineAlignCenter,
  AiOutlineArrowLeft,
} from "react-icons/ai";
import { MdNotifications } from "react-icons/md";
import { BsFillArrowLeftCircleFill, BsArrowLeftShort } from "react-icons/bs";
import { BiSearchAlt } from "react-icons/bi";
import { FaPeopleCarry } from "react-icons/fa";
import ListComponent from "./subNav/ListComponent";
import facebookIcon from "../assets/logos/facebook.png";
import { AnimatePresence, motion as m } from "framer-motion";
import ListNewFreind from "./subNav/ListNewFreind";
import { Outlet, useNavigate } from "react-router-dom";
import {
  userContextApi,
  userInformation,
} from "../contextAPI/UserContextProvider";
import { REDUCER_USER } from "../reducers_utils/reducer_user";
import { testArray, DataProps } from "../assets/piscum_and_avatar";
import DropDown from "./DropDown/DropDown";
import DropDownChat from "./DropDown/DropDownChat";
import { state_post } from "../reducers_utils/reducer_dropdown_right";
import { reducer_post } from "../reducers_utils/reducer_post";
import { REDUCER_DROPDWON_RIGHT } from "../reducers_utils/reducer_dropdown_right";
import {
  REDUCER_DROPDWON_CHAT,
  reducer_dropdown_chat,
  state_chat,
} from "../reducers_utils/reducer_dropdown_chat";
import { MainContextApi } from "../contextAPI/MainContextProvider";
import Axios from "axios";
import { icons } from "react-icons/lib";
import { list_icon_first, list_icon_second, setIcon } from "./UTIL_KEEP_STUFF";
const NavBar = () => {
  const [searchFriend, setsearchFriend] = React.useState<DataProps[]>([]);
  const refSearch = React.useRef<HTMLInputElement>(null);
  const refDropdown = React.useRef<HTMLDivElement>(null);
  const refIcon = React.useRef<HTMLDivElement>(null);
  const refRightDropDown = React.useRef<HTMLDivElement>(null);
  const refRightDropDownChat = React.useRef<HTMLDivElement>(null);
  const refRightDropDownMessager = React.useRef<HTMLDivElement>(null);
  const refRightDropDownOption = React.useRef<HTMLDivElement>(null);
  const [state, dispatch] = React.useReducer(reducer_post, { ...state_post });
  const [toggleDrawer, settoggleDrawer] = React.useState<boolean>(false);
  const [toggleSearchBar, settoggleSearchBar] = React.useState<boolean>(false);
  /// global state
  const [toggleChat, settoggleChat] = React.useState<boolean>(false);
  const [toggleMessager, settoggleMessager] = React.useState<boolean>(false);
  const [toggleOption, settoggleOption] = React.useState<boolean>(false);
  const { user, Dispatch, user_information } = React.useContext(userContextApi);
  const [windowWidth, setwindowWidth] = React.useState<number>(0);
  const [searchedFriend, setSearchedFriend] = React.useState<userInformation[]>(
    []
  );
  const { current_user } = useContext(MainContextApi);
  const newArray = React.useMemo(() => {
    return testArray;
  }, []);
  React.useEffect(() => {
    if (searchFriend.length === 0) {
      setsearchFriend((prev) => testArray);
    }
    function handlerCancelDropdown(e: MouseEvent) {
      const targetNode = e.target as Node;

      // settoggleSearchBar((prev) => !prev);
      if (!refDropdown?.current?.contains(targetNode)) {
        settoggleSearchBar(false);
      }
    }
    function handlerResize() {
      setwindowWidth((prev) => window.innerWidth);
    }
    window.addEventListener("resize", handlerResize);
    document.addEventListener("mousedown", handlerCancelDropdown);
    return () => {
      window.removeEventListener("resize", handlerResize);
      document.removeEventListener("mousedown", handlerCancelDropdown);
    };
  }, []);

  const widnsize_840 = window.innerWidth < 800;
  const widnsize_1268 = window.innerWidth < 1268;
  const navigate = useNavigate();

  async function CheckSearchFriend(e: ChangeEvent<HTMLInputElement>) {
    const username = e.target.value;
    const url =
      process.env.REACT_APP_PORT + `/user/api/search?name=${username}`;

    const response = await Axios(url, { method: "get" });
    if (response.status === 200) {
      const data = response.data.result;

      setSearchedFriend((prev) => data);
    }
  }
  return (
    <div className="container_Navbar">
      <div className="profile_container">
        <div className="profile_icon" onClick={() => navigate("/Home")}>
          <img src={facebookIcon} alt="" />
        </div>

        {/*  window size */}
        {widnsize_1268 && (
          <div
            className="search_wrapper"
            onClick={() => {
              settoggleSearchBar((prev) => !prev);
            }}
          >
            <AiOutlineSearch size={25} />
          </div>
        )}
        {!widnsize_1268 && (
          <div
            className="profile_search_wrapper"
            onClick={() => settoggleSearchBar((prev) => !prev)}
          >
            <AiOutlineSearch size={25} className="profile_inner_icon_Search" />
            <input
              type="text"
              className="profile_ESsarch"
              placeholder="@Search.."
              onChange={CheckSearchFriend}
            />
          </div>
        )}
        {/* window size */}
        {widnsize_1268 && (
          <div
            className="search_wrapper"
            onClick={() => {
              Dispatch({
                type: REDUCER_USER.TOGGLE_DRAWER,
                payload: {
                  ...user,
                  toggle_drawer: !user.toggle_drawer,
                },
              });
            }}
          >
            <AiOutlineMenu size={25} />
          </div>
        )}
        <AnimatePresence>
          {toggleSearchBar && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="drop_down_container"
              ref={refDropdown}
            >
              <m.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ easings: ["easeInOut"] }}
                className="drop_container_tools_search"
              >
                <div className="wrapper_back" ref={refIcon}>
                  <BsArrowLeftShort
                    size={30}
                    className="back_icon"
                    onClick={() => settoggleSearchBar((prev) => !prev)}
                  />
                </div>
                <div className="wrapper_search">
                  <input
                    autoFocus={toggleSearchBar ? true : false}
                    ref={refSearch}
                    type="text"
                    className="drop_down_search"
                    placeholder="@Search.."
                    onChange={CheckSearchFriend}
                  />
                </div>
              </m.div>

              {/* friends List */}
              <div className="drop_down_fix_tools">
                <span>Latest</span>
                <span className="change">Change</span>
              </div>
              <ul className="drop_down_new_friend_table">
                {searchedFriend.length !== 0 ? (
                  searchedFriend.map((item, index) => (
                    <ListNewFreind
                      key={index}
                      item={item}
                      delay={index}
                      settoggleSearchBar={settoggleSearchBar}
                    />
                  ))
                ) : (
                  <div className="no_searching">
                    <BiSearchAlt size={50} /> No Searching Friend
                  </div>
                )}
              </ul>
            </m.div>
          )}
        </AnimatePresence>
      </div>
      <ul
        className={toggleDrawer ? "container_lists" : "container_lists active"}
      >
        {setIcon &&
          setIcon.map((item, index) => (
            <ListComponent key={index} listname={item} />
          ))}
      </ul>
      <div className="right_tools_container">
        <div
          className="right_tools"
          onClick={(e) => {
            e.stopPropagation();
            settoggleOption((prev) => true);
          }}
        >
          <AiOutlinePlus size={25} color="black" />
        </div>
        <DropDownChat
          list_icon={list_icon_first}
          topic="option"
          refDropDown={refRightDropDownOption}
          setToggle={settoggleOption}
          toggle={toggleOption}
        />
        {/* messager */}
        <div
          className="right_tools"
          onClick={(e) => {
            e.stopPropagation();
            settoggleMessager((prev) => true);
          }}
        >
          <AiFillMessage size={25} color="black" />
        </div>
        <DropDownChat
          list_icon={list_icon_second}
          topic="messenger"
          refDropDown={refRightDropDownMessager}
          setToggle={settoggleMessager}
          toggle={toggleMessager}
        />
        {/* notification */}
        <div
          className="right_tools"
          onClick={(e) => {
            e.stopPropagation();
            settoggleChat((prev) => true);
          }}
        >
          <span className="notification">+9</span>
          <MdNotifications size={25} color="black" />
        </div>
        <DropDownChat
          list_icon={list_icon_first}
          refDropDown={refRightDropDownChat}
          setToggle={settoggleChat}
          toggle={toggleChat}
          topic={"chat"}
        />
        {/* profile */}
        <div
          className="right_tools"
          onClick={(e) => {
            e.stopPropagation();
            dispatch({
              type: REDUCER_DROPDWON_RIGHT.TOGGLE_POST,
              payload: { ...state, toggle_post: true },
            });
          }}
        >
          <img
            src={
              user_information.photoURL
                ? user_information.photoURL
                : "https://picsum.photos/200/300/"
            }
          />
        </div>
        <DropDown
          refRightDropDown={refRightDropDown}
          dispatch={dispatch}
          state={state}
        />
      </div>
    </div>
  );
};

export default React.memo(NavBar);
