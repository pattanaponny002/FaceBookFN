import {
  uploadBytesResumable,
  ref,
  getDownloadURL,
  StorageReference,
} from "firebase/storage";
import { userRegister } from "../../screens/Login";
import Axios from "axios";
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
