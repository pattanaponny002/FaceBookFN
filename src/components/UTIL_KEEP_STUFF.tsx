import { BsCameraVideoFill, BsFillEmojiSmileFill } from "react-icons/bs";
import {
  AiFillPlusCircle,
  AiFillFileImage,
  AiOutlineFileGif,
} from "react-icons/ai";
import { IoMdCall, IoMdSend } from "react-icons/io";
import { BsDashLg } from "react-icons/bs";
import { GrClose } from "react-icons/gr";
import { BiMicrophone } from "react-icons/bi";
import { REDUCER_USER } from "../reducers_utils/reducer_user";
import { Actions, userProps } from "../contextAPI/UserContextProvider";
import { AiOutlineRight, AiOutlineLeft } from "react-icons/ai";
import { BsFillBrightnessHighFill } from "react-icons/bs";
import { GiBrightExplosion } from "react-icons/gi";
import {
  MdBrightness4,
  MdOutlineSwipeRight,
  MdBalance,
  MdAssignmentTurnedIn,
  MdAssessment,
  MdAssignmentAdd,
  MdAssignmentInd,
  MdAssuredWorkload,
  MdBatchPrediction,
} from "react-icons/md";
import { sub_items } from "./DropDown/Card/CardDropDown";
import { spawn } from "child_process";
export const icon_tools = [
  "IoMdCall",
  "BsCameraVideoFill",
  "BsDashLg",
  "GrClose",
];
export const icon_input_tools = [
  "AiFillPlusCircle",
  "AiFillFileImage",
  "AiOutlineFileGif",
  "BsFillEmojiSmileFill",
];
export const icon_input_tools_mp = [
  "AiOutlineFileGif",
  "BsFillEmojiSmileFill",
  "AiFillPlusCircle",
];
export const icon_input_tools_dp = [
  "AiOutlineFileGif",
  "BsFillEmojiSmileFill",
  "AiFillPlusCircle",
];
export function Icon_input_tools_mp(icon: string) {
  switch (icon) {
    case "AiFillPlusCircle":
      return (
        <span className="wrapper_icon_tools">
          <AiFillPlusCircle
            size={25}
            // color="rgb(0, 132, 255)"
            className="icon"
          />
        </span>
      );

    case "AiOutlineFileGif":
      return (
        <span className="wrapper_icon_tools">
          <AiOutlineFileGif size={25} className="icon" />
        </span>
      );
    case "BsFillEmojiSmileFill":
      return (
        <span className="wrapper_icon_tools">
          <BsFillEmojiSmileFill size={25} className="icon" />
        </span>
      );

    default:
      return null;
  }
}
export function icon_item(sub_item: sub_items, index: number) {
  switch (sub_item.name) {
    case "list_1":
      return (
        <li className="list_wrapper" key={index}>
          <div className="wrapper">
            <MdAssessment size={30} />
          </div>
          <span>{sub_item.name}</span>

          <div className="wrapper addition">
            <AiOutlineRight />
          </div>
        </li>
      );
    case "list_2":
      return (
        <li className="list_wrapper" key={index}>
          <div className="wrapper">
            <BsFillBrightnessHighFill size={30} />
          </div>
          <span>{sub_item.name}</span>

          <div className="wrapper addition">
            <AiOutlineRight />
          </div>
        </li>
      );
    case "list_3":
      return (
        <li className="list_wrapper" key={index}>
          <div className="wrapper">
            <GiBrightExplosion size={30} />
          </div>
          <span>{sub_item.name}</span>

          <div className="wrapper addition">
            <AiOutlineRight />
          </div>
        </li>
      );

    case "list_4":
      return (
        <li className="list_wrapper" key={index}>
          <div className="wrapper">
            <MdBrightness4 size={30} />
          </div>
          <span>{sub_item.name}</span>

          {/* <div className="wrapper addition">
              <AiOutlineRight />
            </div> */}
        </li>
      );
    case "list_5":
      return (
        <li className="list_wrapper" key={index}>
          <div className="wrapper">
            <MdOutlineSwipeRight size={30} />
          </div>
          <span>{sub_item.name}</span>

          {/* <div className="wrapper addition">
              <AiOutlineRight />
            </div> */}
        </li>
      );

    case "list_second_1":
      return (
        <li className="list_wrapper" key={index}>
          <div className="wrapper">
            <MdOutlineSwipeRight size={30} />
          </div>
          <span>{sub_item.name}</span>
          {/* 
            <div className="wrapper addition">
              <AiOutlineRight />
            </div> */}
        </li>
      );
    case "list_second_2":
      return (
        <li className="list_wrapper" key={index}>
          <div className="wrapper">
            <MdBalance size={30} />
          </div>
          <span>{sub_item.name}</span>

          {/* <div className="wrapper addition">
              <AiOutlineRight />
            </div> */}
        </li>
      );
    case "list_second_3":
      return (
        <li className="list_wrapper" key={index}>
          <div className="wrapper">
            <MdAssignmentTurnedIn size={30} />
          </div>
          <span>{sub_item.name}</span>

          <div className="wrapper addition">
            <AiOutlineRight />
          </div>
        </li>
      );
    case "list_second_4":
      return (
        <li className="list_wrapper" key={index}>
          <div className="wrapper">
            <MdAssignmentAdd size={30} />
          </div>
          <span>{sub_item.name}</span>

          <div className="wrapper addition">
            <AiOutlineRight />
          </div>
        </li>
      );
    case "list_second_5":
      return (
        <li className="list_wrapper" key={index}>
          <div className="wrapper">
            <MdAssuredWorkload size={30} />
          </div>
          <span>{sub_item.name}</span>

          {/* <div className="wrapper addition">
              <AiOutlineRight />
            </div> */}
        </li>
      );

    default:
      return null;
  }
}
export const setIcon = [
  "AiOutlineHome",
  "AiOutlineShop",
  "FaPeopleCarry",
  "AiOutlineAccountBook",
];
export const list_icon_first = [
  {
    header: "header",
    list_item: [
      {
        list_left: "icon1",
        name: "list_1",
        list_right: "icon1",
      },
      {
        list_left: "icon2",
        name: "list_2",
        list_right: "icon2",
      },
      {
        list_left: "icon3",
        name: "list_3",
        list_right: "icon3",
      },
      {
        list_left: "icon2",
        name: "list_4",
        list_right: "icon2",
      },
      {
        list_left: "icon3",
        name: "list_5",
        list_right: "icon3",
      },
    ],
  },
];
export const list_icon_second = [
  {
    header: "header_2",
    list_item: [
      {
        list_left: "icon1",
        name: "list_second_1",
        list_right: "icon1",
      },
      {
        list_left: "icon2",
        name: "list_second_2",
        list_right: "icon2",
      },
      {
        list_left: "icon3",
        name: "list_second_3",
        list_right: "icon3",
      },
      {
        list_left: "icon1",
        name: "list_second_4",
        list_right: "icon1",
      },
      {
        list_left: "icon2",
        name: "list_second_5",
        list_right: "icon2",
      },
      {
        list_left: "icon3",
        name: "list_second_6",
        list_right: "icon3",
      },
    ],
  },
];
export function chooseSentiment(emotion: string) {
  const sentiment = {
    like: 0,
    love: 0,
    hug: 0,
    laughing: 0,
    sad: 0,

    funny: 0,
    greedy: 0,
    cool: 0,
    angry: 0,
  };
  switch (emotion) {
    case "like":
      return {
        ...sentiment,
        like: 1,
      };
    case "love":
      return {
        ...sentiment,
        love: 1,
      };

    case "laughing":
      return {
        ...sentiment,
        laughing: 1,
      };
    case "sad":
      return {
        ...sentiment,
        sad: 1,
      };
    case "angry":
      return {
        ...sentiment,
        angry: 1,
      };
    case "cool":
      return {
        ...sentiment,
        cool: 1,
      };
    case "funny":
      return {
        ...sentiment,
        funny: 1,
      };
    case "greedy":
      return {
        ...sentiment,
        greedy: 1,
      };
    default:
      return sentiment;
  }
}
export function Icon_switch(
  icon: string,
  Dispatch: (value: Actions) => void,
  user: userProps
) {
  switch (icon) {
    case "IoMdCall":
      return (
        <span>
          <IoMdCall size={15} color="black" className="icon" />;
        </span>
      );

    case "BsCameraVideoFill":
      return (
        <span>
          <BsCameraVideoFill size={15} color="black" className="icon" />
        </span>
      );

    case "BsDashLg":
      return (
        <span>
          <BsDashLg size={15} color="black" className="icon" />
        </span>
      );
    case "GrClose":
      return (
        <span
          className="wrapper_icon"
          onMouseDown={(e) => {
            e.stopPropagation();
            Dispatch({
              type: REDUCER_USER.TOGGLE_CHATBOX,
              payload: { ...user, toggle_chat_box: false },
            });
          }}
        >
          <GrClose size={15} color="black" className="icon" />
        </span>
      );

    default:
      return null;
  }
}
export function Icon_input_tools(icon: string, message: string) {
  switch (icon) {
    case "AiFillPlusCircle":
      return (
        <span className="send">
          <AiFillPlusCircle
            size={20}
            color="rgb(0, 132, 255)"
            className="icon"
          />
        </span>
      );
    // case "AiFillFileImage":
    //   return (
    //     <span className="send">
    //       <AiFillFileImage
    //         style={{ display: message && "none" }}
    //         size={20}
    //         color="rgb(0, 132, 255)"
    //         className="icon"
    //       />
    //     </span>
    //   );
    case "AiOutlineFileGif":
      return (
        <span className="send">
          <AiOutlineFileGif
            style={{ display: message && "none" }}
            size={20}
            color="rgb(0, 132, 255)"
            className="icon"
          />
        </span>
      );
    case "BsFillEmojiSmileFill":
      return (
        <span className="send">
          <BsFillEmojiSmileFill
            style={{ display: message && "none" }}
            size={20}
            color="rgb(0, 132, 255)"
            className="icon"
          />
        </span>
      );

    default:
      return null;
  }
}
const color_gr = "gray";
export function Icon_input_tools_dp(icon: string, size: number) {
  switch (icon) {
    case "AiOutlineFileGif":
      return (
        <span className="wrapper_icon_tools">
          <AiOutlineFileGif size={size} className="icon" />
        </span>
      );
    case "BsFillEmojiSmileFill":
      return (
        <span className="wrapper_icon_tools">
          <BsFillEmojiSmileFill size={size} className="icon" />
        </span>
      );
    case "AiFillPlusCircle":
      return (
        <span className="wrapper_icon_tools">
          <AiFillPlusCircle size={size} className="icon" />
        </span>
      );

    default:
      return null;
  }
}
