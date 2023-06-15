import React from "react";
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
interface sub_items {
  list_left: string;
  name: string;
  list_right: string;
}

interface cart_items {
  header: string;
  list_item: sub_items[];
}

interface CardDropDwonProps {
  item: cart_items;
}

function icon_item(sub_item: sub_items, index: number) {
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

const CardDropDown = ({ item }: CardDropDwonProps) => {
  return (
    <div className="container_table">
      <span className="header">{item.header}</span>
      <ul className="table">
        {item.list_item.map((sub_item, index) => icon_item(sub_item, index))}
      </ul>
    </div>
  );
};

export default CardDropDown;
