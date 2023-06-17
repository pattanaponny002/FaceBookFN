import {
  uploadBytesResumable,
  ref,
  getDownloadURL,
  StorageReference,
} from "firebase/storage";
import { userRegister } from "../../screens/Login";
import Axios from "axios";
import { MessageProps } from "../../components/MainCenterSide/card_component/ChatBox";
import { BoxesChatProps } from "../../contextAPI/ChatBoxContextProvider";
import { userInformation } from "../../contextAPI/UserContextProvider";
import { Socket } from "socket.io-client";

interface CallbackMessageSocket {
  CallbackMessage: MessageProps | null;
  result: boolean;
}
export class MessageChatBoxApi {
  private url;
  private storageRef;
  private image_URL;
  private message;
  private user_information;
  private dataChat;
  constructor(
    storageRef: StorageReference,
    url: string,
    image_URL: File | null,
    message: string,
    user_information: userInformation,
    dataChat: BoxesChatProps
  ) {
    this.url = url;
    this.storageRef = storageRef;
    this.image_URL = image_URL;
    this.message = message;
    this.user_information = user_information;
    this.dataChat = dataChat;
  }

  async handlerSendMessage(): Promise<CallbackMessageSocket> {
    // Function lacks ending return statement and return type does not include 'undefined'
    if (this.image_URL) {
      try {
        await uploadBytesResumable(this.storageRef, this.image_URL);
        const downloadURL = await getDownloadURL(this.storageRef);

        const Message: MessageProps = {
          receiverId: this.user_information._id,
          senderId: this.dataChat.chatuser._id,
          text: this.message,
          photoURL: downloadURL,
          sendAt: new Date().toLocaleString("en-US", {
            day: "numeric",
            month: "short",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          }),
          conversationId: this.dataChat.conversationId,
        };

        const response = await Axios(this.url, {
          method: "post",
          headers: { "Content-Type": "application/json" },
          data: Message,
        });

        if (response.status === 200) {
          const CallbackMessage = response.data.result;
          return { result: true, CallbackMessage };
        } else {
          return { result: false, CallbackMessage: null };
        }
      } catch (error) {
        return { result: false, CallbackMessage: null };
      }
    } else {
      const Message: MessageProps = {
        receiverId: this.user_information._id,
        senderId: this.dataChat.chatuser._id,
        text: this.message,
        sendAt: new Date().toLocaleString("en-US", {
          day: "numeric",
          month: "short",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        }),
        conversationId: this.dataChat.conversationId,
      };

      try {
        const response = await Axios(this.url, {
          method: "post",
          headers: { "Content-Type": "application/json" },
          data: Message,
        });

        if (response.status === 200) {
          const CallbackMessage = response.data.result;
          return { result: true, CallbackMessage };
        } else {
          return { result: false, CallbackMessage: null };
        }
      } catch (error) {
        return { result: false, CallbackMessage: null };
      }
    }
  }
}
export class RegisterApi {
  private url;
  private storageRef;
  private userRegister;
  constructor(
    storageRef: StorageReference,
    userRegister: userRegister,
    url: string
  ) {
    this.storageRef = storageRef;
    this.userRegister = userRegister;
    this.url = url;
  }

  async handlerRegister(): Promise<boolean> {
    try {
      if (this.userRegister.photoURL) {
        await uploadBytesResumable(
          this.storageRef,
          this.userRegister.photoURL
        ).then(() => {
          getDownloadURL(this.storageRef).then(async (downloadURL) => {
            const data = {
              username: this.userRegister.username,
              password: this.userRegister.password,
              phone_number: this.userRegister.phone_number,
              photoURL: downloadURL,
            };

            const result = await Axios(this.url, {
              method: "post",
              data,
              headers: { "Content-Type": "application/json" },
            });
            console.log("ARKKKKKKKKKKKKKK");
            if (result.status === 200) {
              alert(result.data.message);
              return true;
            } else {
              return false;
            }
          });
        });
      } else {
        const data = {
          username: this.userRegister.username,
          password: this.userRegister.password,
          phone_number: this.userRegister.phone_number,
        };
        const result = await Axios(this.url, {
          method: "post",
          data,
          headers: { "Content-Type": "application/json" },
        });

        if (result.status === 200) {
          return true;
        } else {
          return false;
        }
      }
      return true;
    } catch (err) {
      console.error("Error occurred while checking username existence:", err);
      return false;
    }
  }
}
