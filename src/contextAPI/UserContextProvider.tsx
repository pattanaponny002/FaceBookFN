import React, { useState, Dispatch } from "react";
import { reducer_user } from "../reducers_utils/reducer_user";
import { State_user } from "../reducers_utils/reducer_register_ang_login";
import { reducer_information } from "../reducers_utils/reducer_info_utils";
export interface userProps {
  name?: string;
  age: number;
  toggle_drawer?: boolean;
  toggle_dialogue?: boolean;
  toggle_dialogue_main?: boolean;
  toggle_chat_box?: boolean | undefined;
  toggle_dialogue_post?: boolean | undefined;
}
export interface userInformation {
  _id: string;
  username: string;
  password: string;
  phone_number: string;
  photoURL: string;
}
export interface Actions {
  payload: userProps;
  type: string;
}
export interface Action_info {
  payload: userInformation;
  type: string;
}
interface UserContextProps {
  user: userProps;
  Dispatch: Dispatch<Actions>;
  user_information: userInformation;
  Dispatch_info: Dispatch<Action_info>;
}

interface UserProviderProps {
  children: React.ReactNode;
}

const state: userProps = {
  name: "master",
  age: 1,
  toggle_drawer: false,
  toggle_dialogue: false,
  toggle_dialogue_main: false,
  toggle_chat_box: false,
  toggle_dialogue_post: false,
};
const state_info: userInformation = {
  username: "",
  password: "",
  phone_number: "",
  photoURL: "",
  _id: "",
};
export const userContextApi = React.createContext<UserContextProps>({
  user: { ...state },
  Dispatch: () => {},
  user_information: { ...state_info },
  Dispatch_info: () => {},
});
const UserContextProvider = ({ children }: UserProviderProps) => {
  const [user, dispatch] = React.useReducer(reducer_user, { ...state });
  const [user_info, dispatch_info] = React.useReducer(reducer_information, {
    ...state_info,
  });

  const context: UserContextProps = {
    user,
    Dispatch: dispatch,
    user_information: user_info,
    Dispatch_info: dispatch_info,
  };
  return (
    <userContextApi.Provider value={context}>
      {children}
    </userContextApi.Provider>
  );
};

export default UserContextProvider;
