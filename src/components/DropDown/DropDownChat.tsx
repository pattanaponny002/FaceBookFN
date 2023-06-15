import React from "react";
import "../../STYLES/Home/component/DropDownChat/DropDownChat.css";
import { AnimatePresence, motion as m } from "framer-motion";
import { animate_translateY } from "../../motion";
import {
  Action_dropdown_chat,
  State_chat,
} from "../../reducers_utils/reducer_dropdown_chat";
import { AiOutlineRight, AiOutlineLeft } from "react-icons/ai";
import { REDUCER_DROPDWON_CHAT } from "../../reducers_utils/reducer_dropdown_chat";
import CardDropDown from "./Card/CardDropDown";

interface BoxesIcon {
  header: string;
  list_item: {
    list_left: string;
    name: string;
    list_right: string;
  }[];
}
interface DropDownChatPRops {
  refDropDown: React.RefObject<HTMLDivElement>;
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
  toggle: boolean;
  topic: string;
  width?: number;
  height?: number;
  list_icon: BoxesIcon[];
}
const DropDownChat = ({
  refDropDown,
  setToggle,
  toggle,
  topic,
  width,
  height,
  list_icon,
}: // setToggle,
// toggle,
DropDownChatPRops) => {
  function handlerDropDownChat(e: MouseEvent) {
    console.log("clicked");
    if (refDropDown.current) {
      !refDropDown.current.contains(e.target as Node) &&
        setToggle((prev) => false);
    }
  }
  React.useEffect(() => {
    document.addEventListener("mousedown", handlerDropDownChat);
    return () => {
      document.removeEventListener("mousedown", handlerDropDownChat);
    };
  }, []);

  return (
    <AnimatePresence>
      {toggle && (
        <m.div
          style={{ width, height }}
          ref={refDropDown}
          variants={animate_translateY}
          initial="hidden"
          animate="show"
          exit={"removed"}
          transition={{ duration: 0.5 }}
          className="container_dropdownchat"
        >
          {list_icon &&
            list_icon.map((item, index) => <CardDropDown item={item} />)}
        </m.div>
      )}
    </AnimatePresence>
  );
};

export default React.memo(DropDownChat);
