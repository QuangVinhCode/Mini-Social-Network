import React, { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import { API } from "../services/constant";

// Tạo context
const SocketContext = createContext(null);

// Cung cấp socket cho toàn bộ ứng dụng
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Tạo kết nối socket khi component được mount
    const socketInstance = io(API); // Đảm bảo rằng URL của server là chính xác
    
    // Cập nhật socket khi có kết nối
    setSocket(socketInstance);

    // Dọn dẹp khi component bị unmount và khi đóng ứng dụng/tab
    const handleBeforeUnload = () => {
      socketInstance.disconnect(); // Ngắt kết nối socket khi đóng ứng dụng
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup: Xóa listener khi component unmount
    return () => {
      socketInstance.disconnect(); // Ngắt kết nối khi component bị unmount
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

// Hook custom để sử dụng socket ở bất kỳ đâu trong ứng dụng
export const useSocket = () => {
  return useContext(SocketContext);
};
