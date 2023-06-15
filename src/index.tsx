import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import UserContextProvider from "./contextAPI/UserContextProvider";
import MainContextProvider from "./contextAPI/MainContextProvider";
import ChatBoxContextProvider from "./contextAPI/ChatBoxContextProvider";
import PostContextProvider from "./contextAPI/PostContextProvider";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserContextProvider>
        <MainContextProvider>
          <ChatBoxContextProvider>
            <PostContextProvider>
              <App />
            </PostContextProvider>
          </ChatBoxContextProvider>
        </MainContextProvider>
      </UserContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
