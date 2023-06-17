import {
  uploadBytesResumable,
  ref as REF,
  getDownloadURL,
  StorageReference,
} from "firebase/storage";
import { storage } from "../../firebase_config";

import { userInformation } from "../../contextAPI/UserContextProvider";
import Axios from "axios";
import { PostMessage } from "../../contextAPI/PostContextProvider";
interface Data {
  senderId: string;
  text: string;
  photoURL?: string;
  sendAt: number;
}
interface CallbackData {
  result: boolean;
  CallbackPostMessage: Data | null;
}
export class PostMessageApi {
  private url;
  private refStorage;
  private user_information;
  private image_URL;
  private text;
  constructor(
    url: string,
    refStorage: StorageReference,
    user_information: userInformation,
    image_URL: File | null,
    text: string
  ) {
    this.url = url;
    this.refStorage = refStorage;
    this.user_information = user_information;
    this.image_URL = image_URL;
    this.text = text;
  }

  async handlernewPost(): Promise<CallbackData> {
    if (this.image_URL) {
      try {
        await uploadBytesResumable(this.refStorage, this.image_URL);
        const downloadURL = await getDownloadURL(this.refStorage);
        const data = {
          senderId: this.user_information?._id,
          text: this.text,
          photoURL: downloadURL,
          sendAt: Date.now(),
        };

        const response = await Axios(this.url, {
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
        });

        if (response.status === 200) {
          const CallbackPostMessage = response.data.result;
          return { result: true, CallbackPostMessage };
        } else {
          return { result: false, CallbackPostMessage: null };
        }
      } catch (err) {
        return { result: false, CallbackPostMessage: null };
      }
    } else {
      try {
        const data = {
          senderId: this.user_information?._id,
          text: this.text,
          sendAt: Date.now(),
        };

        const response = await Axios(this.url, {
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
        });
        if (response.status === 200) {
          const CallbackPostMessage = response.data.result;
          return { result: true, CallbackPostMessage };
        } else {
          return { result: false, CallbackPostMessage: null };
        }
      } catch (err) {
        return { result: false, CallbackPostMessage: null };
      }
    }
  }
}
