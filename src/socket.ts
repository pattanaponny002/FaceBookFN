import io from "socket.io-client";

const URL = process.env.REACT_APP_PORT;

export const socket = io(URL + "");
