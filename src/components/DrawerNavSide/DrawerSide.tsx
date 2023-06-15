import React from "react";
import { userContextApi } from "../../contextAPI/UserContextProvider";
import { REDUCER_USER } from "../../reducers_utils/reducer_user";
import "../../STYLES/Home/component/DrawerNavSide/DrawerNavSide.css";
import { table1, table2 } from "../../assets/drawer_util";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";
import { AnimatePresence, animate } from "framer-motion";
import { motion as m } from "framer-motion";
import { testArray, DataProps } from "../../assets/piscum_and_avatar";
import { NAMES } from "../../assets/names/names_1";
import { places } from "../../assets/names/place";
const DrawerSide = () => {
  const { user, Dispatch, user_information } = React.useContext(userContextApi);
  const [toggle, settoggle] = React.useState<boolean>(false);
  const [drawerBackdrop, setdrawerBackdrop] = React.useState<DataProps[]>([]);
  const [name, setName] = React.useState<string[]>([]);
  // async function fetchData(url: string) {
  //   const response = await fetch(proxyUrl + url, {
  //     headers: { "Content-Type": "application/json" },
  //   });
  //   return response.json();
  // }
  // function getRandomValue() {
  //   return Math.random() - 0.5;
  // }

  React.useEffect(() => {
    if (drawerBackdrop.length === 0) {
      setdrawerBackdrop((prev) => testArray);
    }
    if (name.length === 0) {
      setName((prev) => NAMES);
    }
    return () => {};
  }, []);
  return (
    <div className="component_drawer_Side">
      <ul className="container_lists">
        <li>
          <div className="wrapper_list">
            <img
              className="image_list"
              alt=""
              src={
                user_information.photoURL
                  ? user_information.photoURL
                  : testArray[0].profile
              }
            />
          </div>
          <span>
            {user_information.username ? user_information.username : "DJON AB"}
          </span>
        </li>
        {table2 &&
          table1.map((item, index) => (
            <li className="card_list" key={index}>
              <div className="wrapper_list">
                <img className="image_list" src={item.image} alt="" />
              </div>
              <span>{name[index]}</span>
            </li>
          ))}
      </ul>
      <ul className="container_lists second">
        <li>
          <span>Easiler Way</span>
        </li>
        {drawerBackdrop &&
          drawerBackdrop
            // .sort(() => getRandomValue())
            .slice(0, 7)
            .map((item, index) => (
              <li className="card_list" key={index}>
                <div className="wrapper_list">
                  <img className="image_list" src={item.backdrop} alt="" />
                </div>
                <span>{places[index]?.name}</span>
              </li>
            ))}
        <li>
          <div
            className="wrapper_icon"
            onClick={() => settoggle((prev) => !prev)}
          >
            {toggle ? (
              <AiOutlineArrowDown size={30} />
            ) : (
              <AiOutlineArrowUp size={30} />
            )}
          </div>
          <span>Easiler Way</span>
        </li>
      </ul>
      <AnimatePresence>
        {toggle && (
          <m.ul
            className="container_lists second"
            initial={{ opacity: 0, y: -300 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ easings: ["easeInOut"] }}
          >
            <li>
              <span>Easiler Way</span>
            </li>
            {drawerBackdrop &&
              drawerBackdrop
                // .sort(() => getRandomValue())
                .map((item, index) => (
                  <li className="card_list" key={index}>
                    <div className="wrapper_list">
                      <img className="image_list" src={item.backdrop} alt="" />
                    </div>
                    <span>{places[index]?.name}</span>
                  </li>
                ))}
            <li>
              <div
                className="wrapper_icon"
                onClick={() => settoggle((prev) => !prev)}
              >
                {toggle ? (
                  <AiOutlineArrowDown size={30} />
                ) : (
                  <AiOutlineArrowUp size={30} />
                )}
              </div>
              <span>Easiler Way</span>
            </li>
          </m.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(DrawerSide);
