import React, { FormEvent, FormEventHandler } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "../STYLES/Login/Login.css";
import { testArray, DataProps } from "../assets/piscum_and_avatar";
import {
  AiFillPlusCircle,
  AiFillCamera,
  AiFillEyeInvisible,
  AiFillEye,
} from "react-icons/ai";
import { userContextApi, userProps } from "../contextAPI/UserContextProvider";
import {
  REDUCER_INFORMATION,
  reducer_login_and_user,
  state_user,
  State_user,
} from "../reducers_utils/reducer_register_ang_login";
import Axios from "axios";
import { patterns_check } from "../assets/regex_utils";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase_config";
import { RegisterApi } from "../assets/classes/register_utils_and_chatbox";
import { REDUCER_CURRENT_INFORMATION } from "../reducers_utils/reducer_info_utils";
import { CircularProgress } from "@mui/material";
import empty_user from "../assets/logos/user (3).png";
interface MessageProps {
  text: string;
  createdAt: string;
}
export interface userLogin {
  username: string;
  password: string;
}
export interface userRegister {
  username: string;
  password: string;
  phone_number: string;
  photoURL: File | null;
}
export interface useAutoSave {
  username: string;
  password: string;
  phone_number: string;
  photoURL: string | undefined;
}

export interface isSecured {
  register_security: boolean;
  login_security: boolean;
}

interface Check {
  username: boolean;
  password: boolean;
  phone_number: boolean;
  checkExist: boolean;
}
const Login = () => {
  const [account, setAccount] = React.useState<DataProps[] | undefined>(
    undefined
  );

  const [displayMessage, setdisplayMessage] = React.useState<MessageProps[]>(
    []
  );
  const [toggleContainer, settoggleContainer] = React.useState<boolean>(false);
  const navigate = useNavigate();
  const { user_information, Dispatch_info } = React.useContext(userContextApi);
  const [state, dispatch] = React.useReducer(
    reducer_login_and_user,
    state_user
  );

  const [userLogin, setuserLogin] = React.useState<userLogin>({
    username: "",
    password: "",
  });
  const [useAutoSave, setuseAutoSave] = React.useState<useAutoSave>({
    username: "",
    password: "",
    phone_number: "",
    photoURL: undefined,
  });
  const [isLoading, setisLoading] = React.useState(false);
  const [isLoadingLogin, setisLoadingLogin] = React.useState(false);
  const [userRegister, setuserRegsiter] = React.useState<userRegister>({
    username: "",
    password: "",
    phone_number: "",
    photoURL: null,
  });

  const [CheckedText, setCheckedText] = React.useState<Check>({
    username: false,
    password: false,
    phone_number: false,
    checkExist: false,
  });

  const allChecked =
    CheckedText.username &&
    CheckedText.password &&
    CheckedText.phone_number &&
    !CheckedText.checkExist;

  const [isSecured, setisSecured] = React.useState<isSecured>({
    register_security: true,
    login_security: true,
  });
  async function handlerLogin(e?: FormEvent | undefined) {
    e?.preventDefault();
    try {
      if (userLogin.username && userLogin.password) {
        setisLoading(true);
        const url = process.env.REACT_APP_PORT + "/user/api/login";
        const data = {
          username: userLogin.username,
          password: userLogin.password,
        };

        const result = await Axios(url, {
          method: "post",
          data,
          headers: { "Content-Type": "application/json" },
        });
        Dispatch_info({
          type: REDUCER_CURRENT_INFORMATION.SET_LOGIN_INFORMATION,
          payload: { ...state, ...result.data.result },
        });
        if (result.status === 200) {
          localStorage.setItem("autoSaveUser", JSON.stringify(data));

          // not found
          alert(result.data.message);
          setTimeout(() => {
            setisLoading(false);
            navigate("/Home");
          }, 1000);
        } else {
          alert(
            "NO found the username or this accout available.. please register"
          );
          settoggleContainer((prev) => !false);
          setisLoading(false);
          return;
        }
      } else {
        alert(
          "Either username or password could not be blank please fill up the username and password accordingly"
        );
        return;
      }
    } catch (err) {
      alert("ERROR Incorrect username or password");
      setuserLogin((prev) => ({ ...userLogin, username: "", password: "" }));
      setisLoading(false);
    }
  }
  async function handlerRegister(e: FormEvent) {
    e.preventDefault();

    const url = process.env.REACT_APP_PORT + "/user/api/add";

    const refStoreage = ref(storage, "/Potatoes/" + Date.now().toString());
    const registerApi = new RegisterApi(refStoreage, userRegister, url);
    const result = await registerApi.handlerRegister();
    // const result = new RegisterApi(refStoreage,userRegister)
    if (result) {
      // alert("Register Successfully");
      setuserLogin((prev) => ({ ...prev, ...userRegister }));
      Object.keys(userRegister).forEach((item) =>
        setuserRegsiter((prev) => ({ ...prev, [item]: "" }))
      );
      settoggleContainer((prev) => !prev);
    }
  }

  async function checkAvailable(username: string) {
    const url = process.env.REACT_APP_PORT + `/user/api/find?name=${username}`;
    const response = await Axios(url, { method: "get" });
    const isExist = response.data.result;
    if (isExist === null) {
      setCheckedText((prev) => ({ ...prev, checkExist: false }));
    } else {
      setCheckedText((prev) => ({ ...prev, checkExist: true }));
    }
  }

  //get username from

  async function onhandlerFetchAutoSave(username: string) {
    if (username) {
      const url =
        process.env.REACT_APP_PORT + `/user/api/find?name=${username}`;
      const response = await Axios(url, { method: "get" });
      if (response.status === 200) {
        const userAutosave = response.data.result;

        setuseAutoSave((prev) => userAutosave);
        Dispatch_info({
          type: REDUCER_CURRENT_INFORMATION.SET_LOGIN_INFORMATION,
          payload: { ...state, ...userAutosave },
        });
      }
    }
  }
  // adter clock pass the info to login inputElement
  function onhandlerAutoSave() {
    setisLoading(true);
    if (useAutoSave) {
      const autoSaveLogin = localStorage.getItem("autoSaveUser");

      const parsedUser = autoSaveLogin && JSON.parse(autoSaveLogin);
      setuserLogin((prev) => parsedUser);

      setTimeout(() => {
        setisLoading(false);
        navigate("/Home");
      }, 2000);
    }
  }

  React.useEffect(() => {
    if (!useAutoSave.username || !useAutoSave.password) {
      const autoSave = localStorage.getItem("autoSaveUser"); // how to set as <userLogin>
      console.log("save", autoSave);
      if (autoSave) {
        const parsedUser = JSON.parse(autoSave);
        console.log(parsedUser);
        onhandlerFetchAutoSave(parsedUser.username);
      } else {
        return;
      }
    }
    return () => {};
  }, []);
  React.useEffect(() => {
    if (!account) {
      setAccount((prev) => testArray);
    }

    return () => {};
  }, []);

  React.useEffect(() => {
    function validate(
      filename: keyof typeof patterns_check,
      userRegister: userRegister
    ) {
      const checked = patterns_check[filename].test(userRegister[filename]);
      setCheckedText((prev) => ({ ...prev, [filename]: checked }));
    }
    Object.keys(patterns_check).map((filename) => {
      validate(filename as keyof typeof patterns_check, userRegister);
    });
    return () => {};
  }, [userRegister]);

  return (
    <div className="container_login">
      <div className="container_content">
        <div className="container_adding">
          <div className="boxes">
            <span className="facebook">facebook</span>
            <div className="des">
              <span className="login">Latest Login</span>
              <span className="choose">
                Choose picture or register your account
              </span>
            </div>
            <div className="container_account">
              <div className="card_account" onClick={onhandlerAutoSave}>
                {isLoading && (
                  <div className="loading_card">
                    <CircularProgress />
                  </div>
                )}
                {useAutoSave?.photoURL ? (
                  <div className="wrapper_image">
                    <img src={useAutoSave?.photoURL} alt="" />
                  </div>
                ) : (
                  <div
                    className="wrapper_image"
                    style={{ backgroundColor: "rgba(201, 193, 193, 0.5)" }}
                  >
                    <img src={account?.[0].profile} alt="" />
                  </div>
                )}
                {useAutoSave.username ? (
                  <div className="tools">
                    <span>{useAutoSave?.username}</span>
                  </div>
                ) : (
                  <div className="tools">
                    <span>NO USER AVAILABLE</span>
                  </div>
                )}
              </div>
              <div className="card_account">
                <div className="wrapper_image">
                  <AiFillPlusCircle size={50} color="rgb(0, 132, 255)" />
                </div>
                <div className="tools">
                  <span>Add an account</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container_template_login">
          <div className="boxes_login">
            <div className={toggleContainer ? "wrapper active" : "wrapper"}>
              <form className="form_login" onSubmit={handlerLogin}>
                {isLoading && (
                  <div className="loading_form">
                    <CircularProgress />
                  </div>
                )}
                <div className="section1">
                  <span className="login">Login</span>
                </div>
                <div className="section1">
                  <div className="wrapper_input">
                    <input
                      value={userLogin.username}
                      type="text"
                      placeholder="Email or Account"
                      onChange={(e) =>
                        setuserLogin((prev) => ({
                          ...prev,
                          username: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="wrapper_input">
                    <input
                      value={userLogin.password}
                      type={isSecured.login_security ? "password" : "text"}
                      placeholder="Password"
                      onChange={(e) =>
                        setuserLogin((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                    />
                    <div
                      className="wrapper_icon"
                      onClick={() =>
                        setisSecured((prev) => ({
                          ...prev,
                          login_security: !isSecured.login_security,
                        }))
                      }
                    >
                      {isSecured.login_security ? (
                        <AiFillEyeInvisible size={30} />
                      ) : (
                        <AiFillEye size={30} />
                      )}
                    </div>
                  </div>
                </div>
                <div className="section1 line">
                  <button type="submit" className="btn_register">
                    Login
                  </button>
                  <span className="forget_password">
                    Forget password or not{" "}
                  </span>
                </div>
                <div className="section1 new_account">
                  <button
                    type="button"
                    className="new_account"
                    onClick={() => settoggleContainer((prev) => !prev)}
                  >
                    New Account
                  </button>
                </div>
              </form>

              <form className="form_register" onSubmit={handlerRegister}>
                <div className="section1">
                  <div className="wrapper_profile">
                    <img
                      src={
                        userRegister.photoURL
                          ? URL.createObjectURL(userRegister.photoURL)
                          : require("../assets/logos/man.png")
                      }
                      alt=""
                    />

                    <input
                      type="file"
                      accept=".jpg, .jpeg, .png, image/jpeg, image/png"
                      className="file_selection"
                      id="selection_image"
                      onChange={(e) =>
                        setuserRegsiter((prev) => ({
                          ...prev,
                          photoURL: e.target.files
                            ? e?.target?.files?.[0]
                            : null,
                        }))
                      }
                    />
                    <label
                      className="wrapper_selection"
                      htmlFor="selection_image"
                    >
                      <AiFillCamera size={30} />
                    </label>
                  </div>
                </div>
                <div className="section1">
                  <div
                    className="wrapper_input"
                    style={{
                      borderColor:
                        userRegister.username.length === 0
                          ? "gray"
                          : CheckedText.username
                          ? "rgb(0, 132, 255)"
                          : "crimson",
                    }}
                  >
                    <input
                      value={userRegister.username}
                      type="text"
                      placeholder="Email or Account"
                      onChange={(e) => {
                        checkAvailable(e.target.value);
                        setuserRegsiter((prev) => ({
                          ...prev,
                          username: e.target.value,
                        }));
                      }}
                    />
                    <span
                      className="available_text"
                      style={{
                        color:
                          userRegister.username.length === 0
                            ? "gray"
                            : CheckedText.checkExist
                            ? "crimson"
                            : "mediumseagreen",
                      }}
                    >
                      {userRegister.username.length === 0
                        ? "empty"
                        : CheckedText.checkExist
                        ? "Already in use"
                        : "Available"}
                    </span>
                  </div>
                  <div
                    className="wrapper_input"
                    style={{
                      borderColor:
                        userRegister.password.length === 0
                          ? "gray"
                          : CheckedText.password
                          ? "rgb(0, 132, 255)"
                          : "crimson",
                    }}
                  >
                    <input
                      value={userRegister.password}
                      type={isSecured.register_security ? "password" : "text"}
                      placeholder="Password"
                      onChange={(e) =>
                        setuserRegsiter((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                    />
                    <div
                      style={{
                        borderColor:
                          userRegister.password.length === 0
                            ? "gray"
                            : CheckedText.password
                            ? "rgb(0, 132, 255)"
                            : "crimson",
                      }}
                      className="wrapper_icon"
                      onClick={() =>
                        setisSecured((prev) => ({
                          ...prev,
                          register_security: !isSecured.register_security,
                        }))
                      }
                    >
                      {isSecured.register_security ? (
                        <AiFillEyeInvisible size={30} />
                      ) : (
                        <AiFillEye size={30} />
                      )}
                    </div>
                  </div>
                  <div
                    className="wrapper_input"
                    style={{
                      borderColor:
                        userRegister.phone_number.length === 0
                          ? "gray"
                          : CheckedText.phone_number
                          ? "rgb(0, 132, 255)"
                          : "crimson",
                    }}
                  >
                    <input
                      maxLength={10}
                      value={userRegister.phone_number}
                      type="text"
                      placeholder="(+66)984325555"
                      onChange={(e) =>
                        setuserRegsiter((prev) => ({
                          ...prev,
                          phone_number: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="section_controller">
                  <span onClick={() => settoggleContainer((prev) => !prev)}>
                    Already have own account, go to login page?
                  </span>
                </div>
                <div className="section1 new_account">
                  <button
                    type="submit"
                    className="new_account"
                    // onClick={() => settoggleContainer((prev) => !prev)}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
