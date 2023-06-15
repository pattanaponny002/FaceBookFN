import React, { Dispatch } from "react";
export interface State_user {
  username: string;
  password: string;
  phone_number: string;
  photoURL: File | null;
  login_username: string;
  login_password: string;
}
export interface Action_user {
  type: string;
  payload: State_user;
}
export const state_user: State_user = {
  username: "",
  password: "",
  phone_number: "",
  login_username: "",
  login_password: "",
  photoURL: null,
};

export enum REDUCER_INFORMATION {
  REGISTER_PHOTO_URL = "REGISTER_PHOTO_URL",
  REGISTER_USERNAME = "REGISTER_USERNAME",
  REGISTER_PASSWORD = "REGISTER_PASSWORD",
  REGISTER_PHONE_NUMBER = "REGISTER_PHONE_NUMBER",
  LOGIN_PASSWORD = "LOGIN_PASSWORD",
  LOGIN_PHONE_NUMBER = "LOGIN_PHONE_NUMBER",
}
export const reducer_login_and_user = (
  state_chat: State_user,
  action: Action_user
) => {
  switch (action.type) {
    case REDUCER_INFORMATION.REGISTER_PHOTO_URL:
      return { ...state_chat, photoURL: action.payload.photoURL };
    case REDUCER_INFORMATION.REGISTER_USERNAME:
      return { ...state_chat, username: action.payload.username };
    case REDUCER_INFORMATION.REGISTER_PASSWORD:
      return { ...state_chat, password: action.payload.password };
    case REDUCER_INFORMATION.REGISTER_PHONE_NUMBER:
      return { ...state_chat, phone_number: action.payload.phone_number };

    case REDUCER_INFORMATION.LOGIN_PASSWORD:
      return { ...state_chat, login_username: action.payload.login_username };
    case REDUCER_INFORMATION.LOGIN_PHONE_NUMBER:
      return { ...state_chat, login_password: action.payload.login_password };
    default:
      return state_chat;
  }
};
