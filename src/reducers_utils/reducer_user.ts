import React, { Dispatch } from "react";
import { userProps } from "../contextAPI/UserContextProvider";

import { Actions } from "../contextAPI/UserContextProvider";
export enum REDUCER_USER {
  INCREMENT = "INCREMENT",
  DECREMENT = "DECREMENT",
  ADD_PAYLOAD = "ADD_PAYLOAD",
  TOGGLE_DRAWER = "TOGGLE_DRAWER",
  TOGGLE_DIALOGURE = "TOGGLE_DIALOGURE",
  TOGGLE_DIALOGURE_MAIN = "TOGGLE_DIALOGURE_MAIN",
  TOGGLE_CHATBOX = "TOGGLE_CHATBOX",
  TOGGLE_DIALOGURE_POST = "TOGGLE_DIALOGURE_POST",
}

export const reducer_user = (state: userProps, action: Actions) => {
  switch (action.type) {
    case REDUCER_USER.INCREMENT:
      return {
        ...state,
        age: state.age + 1,
      };
    case REDUCER_USER.DECREMENT:
      return {
        ...state,
        age: state.age - 1,
      };
    case REDUCER_USER.ADD_PAYLOAD:
      return {
        ...state,
        age: state.age + action.payload.age,
      };
    case REDUCER_USER.TOGGLE_DRAWER:
      return {
        ...state,
        toggle_drawer: action.payload.toggle_drawer,
      };
    case REDUCER_USER.TOGGLE_DIALOGURE:
      return {
        ...state,
        toggle_dialogue: action.payload.toggle_dialogue,
      };
    case REDUCER_USER.TOGGLE_DIALOGURE_MAIN:
      return {
        ...state,
        toggle_dialogue_main: action.payload.toggle_dialogue_main,
      };
    case REDUCER_USER.TOGGLE_CHATBOX:
      return {
        ...state,
        toggle_chat_box: action.payload.toggle_chat_box,
      };
    case REDUCER_USER.TOGGLE_DIALOGURE_POST:
      return {
        ...state,
        toggle_dialogue_post: action.payload.toggle_dialogue_post,
      };

    default:
      return state;
  }
};
