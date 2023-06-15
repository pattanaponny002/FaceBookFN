import React from "react";
import { MembersProps } from "../screens/Main";
import { userInformation } from "../contextAPI/UserContextProvider";
import {
  DataChatProps,
  BoxesChatProps,
} from "../contextAPI/ChatBoxContextProvider";
export interface Action_chatbox {
  type: string;
  payload: DataChatProps;
}
export enum REDUCER_CHATBOX {
  SET_CURRENT_CHATBOX = "SET_CURRENT_CHATBOX",
  SET_ONLINE_USERS = "SET_ONLINE_USERS",
}

// wrong state props, we have to re-check
export const reducer_chatbox = (
  state: DataChatProps,
  action: Action_chatbox
) => {
  switch (action.type) {
    case REDUCER_CHATBOX.SET_CURRENT_CHATBOX:
      return { ...state, dataChat: { ...action.payload.dataChat } };
    case REDUCER_CHATBOX.SET_ONLINE_USERS:
      return {
        ...state,
        dataChat: {
          ...state.dataChat,
          onlineUsers: action.payload.dataChat.onlineUsers,
        },
      };
    default:
      return state;
  }
};
