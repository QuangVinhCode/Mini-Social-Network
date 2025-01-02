import React from "react";
import { useSocket } from "../helpers/SocketContext";

// HOC để truyền socket vào component
const withSocket = (Component) => {
  return (props) => {
    const socket = useSocket();
    return <Component {...props} socket={socket} />;
  };
};

export default withSocket;
