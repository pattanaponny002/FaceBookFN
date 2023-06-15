import React from "react";

import { TempUser } from "../contextAPI/MainContextProvider";
export interface Action_reducer_main {
  type: string;
  payload: TempUser;
}

export enum REDUCER_CURRENT_MAIN {
  SET_MAIN_CURRENT_USER = "SET_MAIN_CURRENT_USER",
}
export const reducer_main = (state: TempUser, action: Action_reducer_main) => {
  switch (action.type) {
    case REDUCER_CURRENT_MAIN.SET_MAIN_CURRENT_USER:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
};
