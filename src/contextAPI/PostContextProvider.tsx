import React, { Dispatch } from "react";
import { reducer_dialogue_post } from "../reducers_utils/reducer_dialogue_post";
export interface PostMessage {
  _id?: string;
  text: string;
  senderId: string;
  sendAt: string;
  photoURL?: string;
  createdAt: string;
}

export interface ActionPost {
  type: string;
  payload: PostMessage;
}

export interface initialState {
  post_message: PostMessage;
}

interface PostContext {
  post_message: PostMessage;
  Dispatch_Post: Dispatch<ActionPost>;
}

interface PostContextProvider {
  children: React.ReactNode;
}

const state_dialogue_post = {
  post_message: {
    _id: "",
    text: "",
    senderId: "",
    sendAt: "",
    photoURL: "",
    createdAt: "",
  },
};

export const PostContextApi = React.createContext<PostContext>({
  post_message: {
    _id: "",
    text: "",
    senderId: "",
    sendAt: "",
    photoURL: "",
    createdAt: "",
  },
  Dispatch_Post: () => {},
});
const PostContextProvider = ({ children }: PostContextProvider) => {
  const [state, dispatch] = React.useReducer(
    reducer_dialogue_post,
    state_dialogue_post
  );
  const context: PostContext = {
    post_message: { ...state.post_message },
    Dispatch_Post: dispatch,
  };
  return (
    <PostContextApi.Provider value={context}>
      {children}
    </PostContextApi.Provider>
  );
};

export default PostContextProvider;
