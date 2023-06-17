import {
  uploadBytesResumable,
  ref as REF,
  getDownloadURL,
  StorageReference,
} from "firebase/storage";
import { storage } from "../../firebase_config";
import { PostMessage } from "../../contextAPI/PostContextProvider";
import { userInformation } from "../../contextAPI/UserContextProvider";
import Axios from "axios";
import { DisplayMessageProps } from "../../components/MainCenterSide/card_component/DialoguePost";
interface ReturnDialogue {
  result: boolean;
  arraivalMessage: DisplayMessageProps | null;
}
export class Dialogue_api {
  private url;
  private refStorage;
  private post_message;
  private user_information;
  private image_URL;
  private text;
  constructor(
    url: string,
    image_URL: File | null,
    refStorage: StorageReference,
    post_message: PostMessage,
    user_information: userInformation,
    text: string
  ) {
    this.url = url;
    this.image_URL = image_URL;
    this.refStorage = refStorage;
    this.post_message = post_message;
    this.user_information = user_information;
    this.text = text;
  }

  async handlerDialoguePost(): Promise<ReturnDialogue> {
    if (this.image_URL) {
      try {
        await uploadBytesResumable(this.refStorage, this.image_URL);

        const dowloadURL = await getDownloadURL(this.refStorage);

        const messagePost: DisplayMessageProps = {
          post_id: this.post_message._id ? this.post_message._id : "",
          username: this.user_information.username,
          text: this.text,
          senderId: this.user_information._id,
          sendAt: new Date().getTime(),
          photoURL: this.user_information.photoURL,
          imageURL: dowloadURL,
        };

        const response = await Axios(this.url, {
          method: "post",
          data: messagePost,
          headers: { "Content-Type": "application/json" },
        });
        if (response.status === 200) {
          const arraivalMessage = response.data.result;
          return { result: true, arraivalMessage };
        } else {
          return { result: false, arraivalMessage: null };
        }
      } catch (err) {
        return { result: false, arraivalMessage: null };
      }
    } else {
      const messagePost: DisplayMessageProps = {
        post_id: this.post_message._id ? this.post_message._id : "",
        username: this.user_information.username,
        text: this.text,
        senderId: this.user_information._id,
        sendAt: new Date().getTime(),
        photoURL: this.user_information?.photoURL,
      };

      const url = process.env.REACT_APP_PORT + "/chatpost/api/add";
      try {
        const response = await Axios(url, {
          method: "post",
          data: messagePost,
          headers: { "Content-Type": "application/json" },
        });

        if (response.status === 200) {
          const arraivalMessage = response.data.result;
          return { result: true, arraivalMessage };
        } else {
          return { result: false, arraivalMessage: null };
        }
      } catch (err) {
        return { result: false, arraivalMessage: null };
      }
    }
  }
}
