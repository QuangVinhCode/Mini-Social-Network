import axios from "axios";
import { API_USER } from "./constant";

export default class UserService {
  getToken = () => {
    const jwtToken = sessionStorage.getItem("userSession");
    const sessionToken = jwtToken ? JSON.parse(jwtToken) : null;
    return sessionToken.token;
  };

  insertUser = async (object) => {
    return await axios.post(API_USER, object, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  };
  getUsers = async () => {
    return await axios.get(API_USER, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  };
  registerUser = async (object) => {
    return await axios.post(API_USER, object);
  };
  loginUser = async (user) => {
    return await axios.patch(API_USER, user);
  };
  deleteUser = async (id) => {
    return await axios.delete(API_USER + "/" + id, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  };
  getUser = async (id) => {
    return await axios.get(API_USER + "/" + id, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  };
  updateUser = async (id, object) => {
    let formData = new FormData();

    formData.append("profile.name", object.profile.name);
    formData.append("profile.bio", object.profile.bio);
    formData.append("profile.location", object.profile.location);
    if (object.profile.avatar[0].originFileObj) {
      formData.append("images", object.profile.avatar[0].originFileObj);
    }
    console.log(
      "object in originFileObj: ",
      object.profile.avatar[0].originFileObj
    );
    return await axios.put(API_USER + "/" + id, formData, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  };

  sendFriendRequest = async (object) => {
    return await axios.post(API_USER + "/request-add-friend", object, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  };

  cancelFriendRequest = async (userId, targetId) => {
    return await axios.delete(
      API_USER + "/" + userId + "/request-remove-friend/" + targetId,
      {
        headers: { Authorization: `Bearer ${this.getToken()}` },
      }
    );
  };

  acceptFriendRequest = async (object) => {
    return await axios.post(API_USER + "/add-friend", object, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  };

  declineFriendRequest = async (userId, requesterId) => {
    return await axios.delete(
      API_USER + "/" + userId + "/request-remove-friend/" + requesterId,
      {
        headers: { Authorization: `Bearer ${this.getToken()}` },
      }
    );
  };

  findUserName = async (name) => {
    return await axios.get(API_USER + "/search/" + name, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  };

  getFriendsList = async (userId) => {
    return await axios.get(API_USER + "/friends/" + userId, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  };

  getFriendRequestsList = async (userId) => {
    return await axios.get(API_USER + "/friend-requests/" + userId, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  };

  getFriendRequestsSentList = async (userId) => {
    return await axios.get(API_USER + "/friend-requests-sent/" + userId, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  };

  logoutUser = async (userId) => {
    return await axios.patch(
      API_USER + "/logout",
      { userId },
      {
        headers: { Authorization: `Bearer ${this.getToken()}` },
      }
    );
  };
}
