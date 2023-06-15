import {
  Action_info,
  userInformation,
} from "../contextAPI/UserContextProvider";

export enum REDUCER_CURRENT_INFORMATION {
  SET_LOGIN_INFORMATION = "SET_LOGIN_INFORMATION",
}
export const reducer_information = (
  state: userInformation,
  action: Action_info
) => {
  switch (action.type) {
    case REDUCER_CURRENT_INFORMATION.SET_LOGIN_INFORMATION:
      return { ...state, ...action.payload };

    default:
      return state;
  }
};
