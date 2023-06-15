import React, { Dispatch } from "react";

export interface State {
  toggle_post: boolean;
}
interface Action {
  type: string;
  payload: State;
}
export const state_post: State = {
  toggle_post: false,
};

export enum REDUCER_POST {
  TOGGLE_POST = "TOGGLE_POST",
}
export const reducer_post = (state: State, action: Action) => {
  switch (action.type) {
    case REDUCER_POST.TOGGLE_POST:
      return {
        ...state,
        toggle_post: action.payload.toggle_post,
      };

    default:
      return state; //forget return
  }
};
