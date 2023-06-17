import React, { useRef } from "react";
import "../../../STYLES/Home/component/MessageCard/MessageCard.css";
import { MessageProps } from "./ChatBox";
import { userContextApi } from "../../../contextAPI/UserContextProvider";
import bg from "../../../assets/bg/bg.jpg";
interface MessageCardProps {
  item: MessageProps;
  index: number;
  sendAt: string;
  isToday: boolean;
  isAlreadyset: boolean;
  isJustNow: boolean;
}
const MessageCard = ({
  item,
  index,
  sendAt,
  isToday,
  isAlreadyset,
  isJustNow,
}: MessageCardProps) => {
  const { user_information } = React.useContext(userContextApi);

  const isOwe = item.receiverId === user_information._id;

  const refMessage = React.useRef<HTMLDivElement>(null);
  /// making just now
  const [GPTText, setGPTText] = React.useState<string>("");
  function FormattedTodate(sendAt: string) {
    const formatedDate = new Date(sendAt);
    const time = formatedDate.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    });
    return `Today, ${time}`; // Today, 992344725000
  }

  React.useEffect(() => {
    let index = 0;
    let clearTime: NodeJS.Timeout;

    function GPTFormattedText() {
      if (index < item.text.length) {
        const currentText = item.text.charAt(index);
        setGPTText((prev) => prev + currentText);
        index++;
      } else {
        clearInterval(clearTime);
      }
    }
    if (isJustNow) {
      clearTime = setInterval(GPTFormattedText, 100);
    }

    return () => {
      clearInterval(clearTime);
    };
  }, [item.text]);
  React.useEffect(() => {
    return () => {};
  }, [sendAt]);
  React.useEffect(() => {
    if (refMessage.current) {
      refMessage.current.scrollIntoView({ behavior: "smooth" });
    }
    return () => {};
  }, []);
  return (
    <div className="wrapper_message" ref={refMessage}>
      {/* why it not wrapped */}
      {!isAlreadyset && (
        <span
          className="date"
          style={{ alignSelf: isOwe ? "flex-end" : "flex-start" }}
        >
          <span>{isToday ? FormattedTodate(sendAt) : sendAt}</span>
        </span>
      )}
      <div
        className="message"
        style={{
          alignSelf: isOwe ? "flex-end" : "flex-start",
          backgroundColor: isOwe ? "rgb(0, 132, 255)" : "#E4E6EB",
        }}
      >
        {item.text && (
          <span className="text" style={{ color: isOwe ? "white" : "black" }}>
            {item.text}
          </span>
        )}
        {item.photoURL && (
          <div className="wrapper_photoURL">
            <img src={item.photoURL} alt="" />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageCard;
