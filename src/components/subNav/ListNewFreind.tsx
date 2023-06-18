import React, { useContext } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { DataProps } from "../../assets/piscum_and_avatar";
import {
  userContextApi,
  userInformation,
} from "../../contextAPI/UserContextProvider";
import { MainContextApi } from "../../contextAPI/MainContextProvider";
import { REDUCER_CURRENT_MAIN } from "../../reducers_utils/reducer_mainuser";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion as m } from "framer-motion";
import { drop_down, fadeInd_Right } from "../../motion";
import empty_user from "../../assets/logos/user (3).png";
interface ListNewFreindProps {
  item: userInformation;
  delay: number;
  index?: number;
  settoggleSearchBar: React.Dispatch<React.SetStateAction<boolean>>;
}
const ListNewFreind = ({
  item,
  settoggleSearchBar,
  delay,
  index,
}: ListNewFreindProps) => {
  const { current_user, Dispatch_main } = useContext(MainContextApi);
  const navigate = useNavigate();
  return (
    <m.li
      variants={fadeInd_Right}
      initial={"hidden"}
      animate={"show"}
      transition={{ delay: delay * 0.1, easings: ["easeInOut"] }}
      className="card_newfriend"
      onClick={() => {
        Dispatch_main({
          type: REDUCER_CURRENT_MAIN.SET_MAIN_CURRENT_USER,
          payload: { ...item },
        });
        navigate("/Main");
        settoggleSearchBar((prev) => !prev);
      }}
    >
      <div className="first_Section">
        {item.photoURL ? (
          <div className="wrapper_new_friend">
            <img className="img_new_friend" src={item.photoURL} />
          </div>
        ) : (
          <div className="wrapper_new_friend">
            <img className="img_new_friend" src={empty_user} />
          </div>
        )}
        <span>{item.username}</span>
      </div>
      <span className="wrapper_card">
        <AiFillCloseCircle />
      </span>
    </m.li>
  );
};

export default ListNewFreind;
