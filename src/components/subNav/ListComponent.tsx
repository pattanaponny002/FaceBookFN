import { AnimatePresence } from "framer-motion";
import React from "react";
import { motion as m } from "framer-motion";
import { drop_down } from "../../motion";
import {
  AiOutlineHome,
  AiOutlineShop,
  AiOutlineAlignCenter,
  AiOutlineAccountBook,
  AiOutlineUsb,
  AiOutlineAliwangwang,
  AiOutlineMenu,
} from "react-icons/ai";
import { FaPeopleCarry } from "react-icons/fa";
import { userContextApi } from "../../contextAPI/UserContextProvider";
import { REDUCER_USER } from "../../reducers_utils/reducer_user";
interface ListComponentType {
  listname: string;
  animatedList?: boolean;
}
const ListComponent = ({
  listname,
  animatedList = true,
}: ListComponentType) => {
  const { user, Dispatch } = React.useContext(userContextApi);

  function icon(listname: string) {
    switch (listname) {
      case "AiOutlineHome":
        return <AiOutlineHome size={30} color="grey" />;
      case "AiOutlineShop":
        return <AiOutlineShop size={30} color="grey" />;
      case "FaPeopleCarry":
        return <FaPeopleCarry size={30} color="grey" />;
      case "AiOutlineAccountBook":
        return <AiOutlineAccountBook size={30} color="grey" />;
      case "AiOutlineUsb":
        return <AiOutlineUsb size={30} color="grey" />;
      case "AiOutlineAliwangwang":
        return <AiOutlineUsb size={30} color="grey" />;
      case "AiOutlineMenu":
        return (
          <AiOutlineMenu
            size={30}
            color="grey"
            onClick={() => {
              Dispatch({
                type: REDUCER_USER.TOGGLE_DRAWER,
                payload: {
                  ...user,
                  toggle_drawer: !user.toggle_drawer,
                },
              });
            }}
          />
        );

      default:
        return null;
    }
  }
  return (
    <li className="list_component">
      {/* <AnimatePresence>
        {animatedList && toggleDropDown && (
          <m.div
            className="drop_down"
            variants={drop_down}
            initial={"hidden"}
            animate={"show"}
            exit={"removed"}
            transition={{ duration: 0.2 }}
            onMouseEnter={() => settoggleDropDown((prev) => true)}
            onMouseLeave={() => settoggleDropDown((prev) => false)}
          >
            master
          </m.div>
        )}
      </AnimatePresence> */}
      {icon(listname)}
    </li>
  );
};

export default ListComponent;
