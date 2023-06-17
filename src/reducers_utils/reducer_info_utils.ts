import {
  Action_info,
  userInformation,
} from "../contextAPI/UserContextProvider";

export enum REDUCER_CURRENT_INFORMATION {
  SET_LOGIN_INFORMATION = "SET_LOGIN_INFORMATION",
  SET_UPDATE_PROFILE_PICTURE = "SET_UPDATE_PROFILE_PICTURE",
}
export const reducer_information = (
  state: userInformation,
  action: Action_info
) => {
  switch (action.type) {
    case REDUCER_CURRENT_INFORMATION.SET_LOGIN_INFORMATION:
      return { ...state, ...action.payload };
    case REDUCER_CURRENT_INFORMATION.SET_UPDATE_PROFILE_PICTURE:
      return { ...state, photoURL: action.payload.photoURL };

    default:
      return state;
  }
};
