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
import { icon_item } from "../../UTIL_KEEP_STUFF";
export interface sub_items {
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
