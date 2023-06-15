import React from "react";

import { ActionPost } from "../contextAPI/PostContextProvider";

import { initialState } from "../contextAPI/PostContextProvider";

export enum REDUCER_DIALOGUE_POST_MESSAGE {
  SET_POST_MESSAGE = "SET_POST_MESSAGE",
}
export const reducer_dialogue_post = (
  state: initialState,
  action: ActionPost
) => {
  switch (action.type) {
    case REDUCER_DIALOGUE_POST_MESSAGE.SET_POST_MESSAGE:
      return {
        ...state,
        post_message: { ...action.payload },
      };

    default:
      return state;
  }
};
