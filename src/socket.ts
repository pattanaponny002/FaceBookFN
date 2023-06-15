import io from "socket.io-client";

const URL = process.env.REACT_APP_PORT ? "http://localhost:4000" : undefined;

export const socket = io(URL + "");
