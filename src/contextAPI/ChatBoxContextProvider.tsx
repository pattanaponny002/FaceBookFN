import React, { Dispatch } from "react";

import { userInformation } from "./UserContextProvider";
import { reducer_chatbox } from "../reducers_utils/reducer_chatbox";
import { reducer_main } from "../reducers_utils/reducer_mainuser";
import { Action_chatbox } from "../reducers_utils/reducer_chatbox";
import { onlineUser } from "../components/ChatNavSide/ChatSide";
export interface BoxesChatProps {
  chatuser: userInformation;
  conversationId: string;
  onlineUsers?: onlineUser[];
}
interface ChatContext {
  dataChat: BoxesChatProps;
  Dispatch_chatbox: Dispatch<Action_chatbox>;
}
export interface DataChatProps {
  dataChat: BoxesChatProps;
}
const state_chatBox: DataChatProps = {
  dataChat: {
    chatuser: {
      _id: "",
      username: "",
      password: "",
      phone_number: "",
      photoURL: "",
    },
    conversationId: "",
    onlineUsers: [],
  },
};

export const ChatBoxContextApi = React.createContext<ChatContext>({
  dataChat: {
    chatuser: {
      _id: "",
      username: "",
      password: "",
      phone_number: "",
      photoURL: "",
    },
    conversationId: "",
    onlineUsers: [],
  },
  Dispatch_chatbox: () => {},
});

interface ChatBoxContextProps {
  children: React.ReactNode;
}
const ChatBoxContextProvider = ({ children }: ChatBoxContextProps) => {
  const [state, dispatch] = React.useReducer(reducer_chatbox, state_chatBox);

  const context: ChatContext = {
    dataChat: state.dataChat,
    Dispatch_chatbox: dispatch,
  };
  return (
    <ChatBoxContextApi.Provider value={context}>
      {children}
    </ChatBoxContextApi.Provider>
  );
};

export default ChatBoxContextProvider;
