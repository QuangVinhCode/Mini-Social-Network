import axios from "axios";
import { API_MESSAGE } from "./constant";

export default class MessageService {
  getToken = () => {
    const jwtToken = sessionStorage.getItem("userSession");
    const sessionToken = jwtToken ? JSON.parse(jwtToken) : null;
    return sessionToken.token;
  };

  sendMessage = async (object) => {
    return await axios.post(API_MESSAGE, object, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  };
  getMessages = async (userId1, userId2) => {
    return await axios.get(
      API_MESSAGE + "/conversation/" + userId1 + "/" + userId2,
      {
        headers: { Authorization: `Bearer ${this.getToken()}` },
      }
    );
  };
  getLastMessage = async (id) => {
    return await axios.get(API_MESSAGE + "/last-message/" + id, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  };
  deleteMessage = async (id) => {
    return await axios.delete(API_MESSAGE + "/" + id, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  };
  updateMessage = async (id, object) => {
    return await axios.patch(API_MESSAGE + "/" + id, object, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  };

  markMessage = async (id) => {
    return await axios.patch(
      API_MESSAGE + "/mark-read",
      { id },
      {
        headers: { Authorization: `Bearer ${this.getToken()}` },
      }
    );
  };
}
