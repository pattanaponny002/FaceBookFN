import {
  uploadBytesResumable,
  ref as REF,
  getDownloadURL,
  StorageReference,
} from "firebase/storage";
import { storage } from "../../firebase_config";
import { userInformation } from "../../contextAPI/UserContextProvider";
import Axios from "axios";
import { DisplayMessageProps } from "../../components/MainCenterSide/card_component/DialoguePost";
import { DisplayRepliesProps } from "../../components/MainCenterSide/card_component/MediumPostCard";

interface ReturnMedium {
  result: boolean;
  arraivalMEdiumMessage: DisplayRepliesProps | null;
}

export class MediumPostApi {
  private url;
  private refStorageRef;
  private user_information;
  private image_URL;
  private text;
  private toReplies;
  private item;
  constructor(
    url: string,
    image_URL: File | null,
    refStorageRef: StorageReference,
    user_information: userInformation,
    text: string,
    toReplies: string,
    item: DisplayMessageProps
  ) {
    this.url = url;
    this.image_URL = image_URL;
    this.refStorageRef = refStorageRef;
    this.user_information = user_information;
    this.text = text;
    this.toReplies = toReplies;
    this.item = item;
  }

  async handlerSendMediumPost(): Promise<ReturnMedium> {
    if (this.image_URL && this.item._id) {
      try {
        await uploadBytesResumable(this.refStorageRef, this.image_URL);

        const downloadURL = await getDownloadURL(this.refStorageRef);

        const data: DisplayRepliesProps = {
          message_id: this.item._id,
          username: this.user_information.username,
          text: this.text,
          senderId: this.user_information._id,
          toReplies: this.toReplies,
          sendAt: new Date().getTime(),
          photoURL: this.user_information.photoURL,
          imageURL: downloadURL,
        };
        const url = process.env.REACT_APP_PORT + "/repliedchat_post/api/add";
        const response = await Axios(url, {
          method: "post",
          data,
          headers: { "Content-Type": "application/json" },
        });

        if (response.status === 200) {
          const arraivalMEdiumMessage = response.data.result;
          return {
            result: true,
            arraivalMEdiumMessage,
          };
        } else {
          return {
            result: false,
            arraivalMEdiumMessage: null,
          };
        }
      } catch (err) {
        return {
          result: false,
          arraivalMEdiumMessage: null,
        };
      }
    } else {
      const data: DisplayRepliesProps = {
        message_id: this.item._id ? this.item._id : "",
        username: this.user_information.username,
        text: this.text,
        senderId: this.user_information._id,
        toReplies: this.toReplies,
        sendAt: new Date().getTime(),
        photoURL: this.user_information.photoURL,
      };

      try {
        const url = process.env.REACT_APP_PORT + "/repliedchat_post/api/add";
        const response = await Axios(url, {
          method: "post",
          data,
          headers: { "Content-Type": "application/json" },
        });

        if (response.status === 200) {
          const arraivalMEdiumMessage = response.data.result;
          return {
            result: true,
            arraivalMEdiumMessage,
          };
        } else {
          return {
            result: false,
            arraivalMEdiumMessage: null,
          };
        }
      } catch (err) {
        return {
          result: false,
          arraivalMEdiumMessage: null,
        };
      }
      // if (response.status === 200) {
      //   const arraivalMessage = response.data.result;
      //   setdisplayRepliesMessage((prev) => [...prev, arraivalMessage]);
      //   setrepliedText((prev) => "");
      //   setTimeout(() => {
      //     settoggleSubReplies((prev) => false);
      //     callbackIsLoading(false);
      //   }, 500);
      // }
    }
  }
}
