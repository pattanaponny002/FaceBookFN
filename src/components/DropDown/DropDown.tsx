import React from "react";
import "../../STYLES/Home/component/DropDown/DropDown.css";
import { AnimatePresence, motion as m } from "framer-motion";
import { drop_down, animate_translateY } from "../../motion";
import {
  Action_dropdown,
  state_post,
  State,
} from "../../reducers_utils/reducer_dropdown_right";
import { REDUCER_DROPDWON_RIGHT } from "../../reducers_utils/reducer_dropdown_right";
import { DataProps } from "../../assets/piscum_and_avatar";
import {
  AiFillSetting,
  AiFillQuestionCircle,
  AiOutlineRight,
  AiFillHome,
} from "react-icons/ai";
import { BsFillMoonFill, BsMoonFill } from "react-icons/bs";
import { BiLogOutCircle } from "react-icons/bi";
import { testArray } from "../../assets/piscum_and_avatar";
import { useNavigate } from "react-router-dom";
import { userContextApi } from "../../contextAPI/UserContextProvider";
import { MainContextApi } from "../../contextAPI/MainContextProvider";
import { REDUCER_CURRENT_MAIN } from "../../reducers_utils/reducer_mainuser";
import { REDUCER_CURRENT_INFORMATION } from "../../reducers_utils/reducer_info_utils";
import { REDUCER_USER } from "../../reducers_utils/reducer_user";
import { socket } from "../../socket";
interface DropDownPRops {
  refRightDropDown: React.RefObject<HTMLDivElement>;
  dispatch: React.Dispatch<Action_dropdown>;
  state: State;
}
const DropDown = ({ refRightDropDown, dispatch, state }: DropDownPRops) => {
  function handlerCloseDropdown(e: MouseEvent) {
    if (refRightDropDown.current) {
      !refRightDropDown.current.contains(e.target as Node) &&
        dispatch({
          type: REDUCER_DROPDWON_RIGHT.TOGGLE_POST,
          payload: { ...state, toggle_post: false },
        });
    }
  }

  const { current_user, Dispatch_main } = React.useContext(MainContextApi);
  const [Data, setData] = React.useState<DataProps[]>([]);
  const { user_information, user, Dispatch } = React.useContext(userContextApi);
  const navigate = useNavigate();
  function NavigateMain() {
    dispatch({
      type: REDUCER_DROPDWON_RIGHT.TOGGLE_POST,
      payload: { ...state, toggle_post: false },
    });
    Dispatch_main({
      type: REDUCER_CURRENT_MAIN.SET_MAIN_CURRENT_USER,
      payload: { ...current_user, ...user_information },
    });
    navigate("/Main");
  }

  React.useEffect(() => {
    if (Data.length === 0) {
      setData((prev) => testArray);
    }
    document.addEventListener("mousedown", handlerCloseDropdown);

    return () => {
      document.removeEventListener("mousedown", handlerCloseDropdown);
    };
  }, []);

  return (
    <AnimatePresence>
      {state.toggle_post && (
        <m.div
          variants={animate_translateY}
          initial={"hidden"}
          animate="show"
          exit={"removed"}
          transition={{ duration: 0.5 }}
          ref={refRightDropDown}
          className="container_Dropdown"
          onMouseOver={(e) => e.stopPropagation()}
        >
          <div className="sub_dropdown">
            <span className="header_tile">title</span>
            <ul className="table">
              <li className="list_titie profile" onClick={NavigateMain}>
                <span className="wrapper_icon">
                  <img
                    src={
                      user_information.photoURL
                        ? user_information.photoURL
                        : Data?.[0].profile
                    }
                    alt=""
                  />
                </span>
                <span>
                  {user_information.username
                    ? user_information.username
                    : "DJ RONB"}
                </span>
                <span className="right">
                  <AiFillHome size={25} />
                </span>
              </li>
              <li className="list_titie">
                <span className="wrapper_icon">
                  <AiFillSetting size={30} />
                </span>
                <span>setting</span>
              </li>
              <li className="list_titie">
                <span className="wrapper_icon">
                  <AiFillQuestionCircle size={30} />
                </span>
                <span>query</span>
                <span className="right">
                  <AiOutlineRight size={25} />
                </span>
              </li>
              <li className="list_titie">
                <span className="wrapper_icon">
                  <BsMoonFill size={30} />
                </span>
                <span>record</span>
                <span className="right">
                  <AiOutlineRight size={25} />
                </span>
              </li>

              <li
                className="list_titie"
                onClick={() => {
                  socket.emit("logout");
                  navigate("/");
                  Dispatch({
                    type: REDUCER_USER.TOGGLE_CHATBOX,
                    payload: { ...user, toggle_chat_box: false },
                  });
                }}
              >
                <span className="wrapper_icon">
                  <BiLogOutCircle size={30} />
                </span>
                <span>logout</span>
              </li>
            </ul>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
};

export default React.memo(DropDown);
