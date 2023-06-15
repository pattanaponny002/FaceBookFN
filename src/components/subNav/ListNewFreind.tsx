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
interface ListNewFreindProps {
  item: userInformation;
  settoggleSearchBar: React.Dispatch<React.SetStateAction<boolean>>;
}
const ListNewFreind = ({ item, settoggleSearchBar }: ListNewFreindProps) => {
  const { current_user, Dispatch_main } = useContext(MainContextApi);
  const { user, Dispatch } = useContext(userContextApi);
  const navigate = useNavigate();
  return (
    <li
      className="card_newfriend"
      onClick={() => {
        Dispatch_main({
          type: REDUCER_CURRENT_MAIN.SET_MAIN_CURRENT_USER,
          payload: { ...item },
        });
        settoggleSearchBar((prev) => !prev);
        navigate("/Main");
      }}
    >
      <div className="first_Section">
        <div className="wrapper_new_friend">
          <img className="img_new_friend" src={item.photoURL} />
        </div>
        <span>{item.username}</span>
      </div>

      <span className="wrapper_card">
        <AiFillCloseCircle />
      </span>
    </li>
  );
};

export default ListNewFreind;
