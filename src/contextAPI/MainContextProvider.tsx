import React, { Dispatch, useState } from "react";
import {
  Action_reducer_main,
  reducer_main,
} from "../reducers_utils/reducer_mainuser";
///
export interface TempUser {
  _id: string;
  username: string;
  password: string;
  phone_number: string;
  photoURL: string;
}
interface MainContextProvider {
  children: React.ReactNode;
}

interface MainContextApi {
  current_user: TempUser;
  Dispatch_main: Dispatch<Action_reducer_main>;
}

export const MainContextApi = React.createContext<MainContextApi>({
  current_user: {
    username: "",
    password: "",
    phone_number: "",
    photoURL: "",
    _id: "",
  },
  Dispatch_main: () => {},
});

const state_main = {
  username: "",
  password: "",
  phone_number: "",
  photoURL: "",
  _id: "",
};
const MainContextProvider = ({ children }: MainContextProvider) => {
  const [state, dispatch] = React.useReducer(reducer_main, { ...state_main });

  const context: MainContextApi = {
    current_user: state,
    Dispatch_main: dispatch,
  };

  return (
    <MainContextApi.Provider value={context}>
      {children}
    </MainContextApi.Provider>
  );
};

export default MainContextProvider;
