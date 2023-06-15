import React, { Dispatch } from "react";
export interface State_chat {
  toggle_chat: boolean;
}
export interface Action_dropdown_chat {
  type: string;
  payload: State_chat;
}
export const state_chat: State_chat = {
  toggle_chat: false,
};

export enum REDUCER_DROPDWON_CHAT {
  TOGGLE_CONVERSATION = "TOGGLE_CONVERSATION",
}
export const reducer_dropdown_chat = (
  state_chat: State_chat,
  action: Action_dropdown_chat
) => {
  switch (action.type) {
    case REDUCER_DROPDWON_CHAT.TOGGLE_CONVERSATION:
      return { ...state_chat, toggle_chat: action.payload.toggle_chat };
    default:
      return state_chat;
  }
};
