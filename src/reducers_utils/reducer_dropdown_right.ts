import React, { Dispatch } from "react";
export interface State {
  toggle_post: boolean;
}
export interface Action_dropdown {
  type: string;
  payload: State;
}
export const state_post: State = {
  toggle_post: false,
};

export enum REDUCER_DROPDWON_RIGHT {
  TOGGLE_POST = "TOGGLE_POST",
  TOGGLE_CONVERSATION = "TOGGLE_CONVERSATION",
}
export const reducer_dropdown = (state: State, action: Action_dropdown) => {
  switch (action.type) {
    case REDUCER_DROPDWON_RIGHT.TOGGLE_POST:
      return { ...state, toggle_post: action.payload.toggle_post };
    default:
      return state;
  }
};
