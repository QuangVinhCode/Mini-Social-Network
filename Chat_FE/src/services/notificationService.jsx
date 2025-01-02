import axios from "axios";
import { API_NOTIFICATION } from "./constant";

export default class NotificationService {
  getToken = () => {
    const jwtToken = sessionStorage.getItem("userSession");
    const sessionToken = jwtToken ? JSON.parse(jwtToken) : null;
    return sessionToken.token;
  };

  getNotifications = async (id) => {
    return await axios.get(API_NOTIFICATION + "/user/" + id, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  };

  countUnreadNotifications = async (id) => {
    return await axios.get(API_NOTIFICATION + "/count-unread/" + id, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  };

  markAsReadNotification = async (id) => {
    return await axios.put(
      API_NOTIFICATION + "/" + id,
      {},
      {
        headers: { Authorization: `Bearer ${this.getToken()}` },
      }
    );
  };

  markAllAskReadNotification = async (id) => {
    return await axios.put(
      API_NOTIFICATION + "/user/" + id,
      {},
      {
        headers: { Authorization: `Bearer ${this.getToken()}` },
      }
    );
  };
  deleteAllNotification = async (id) => {
    return await axios.delete(API_NOTIFICATION + "/user/" + id, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  };
}
