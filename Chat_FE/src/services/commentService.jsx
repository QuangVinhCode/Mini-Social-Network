import axios from "axios";
import { API_COMMENT } from "./constant";

export default class CommentService {
  getToken = () => {
    const jwtToken = sessionStorage.getItem("userSession");
    const sessionToken = jwtToken ? JSON.parse(jwtToken) : null;
    return sessionToken.token;
  };

  insertComment = async (object) => {
    return await axios.post(API_COMMENT, object, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  };
  replyToComment = async (object) => {
    return await axios.post(API_COMMENT + "/reply", object, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  };
  getComments = async () => {
    return await axios.get(API_COMMENT);
  };
  getCommentsByPost = async (id) => {
    return await axios.get(API_COMMENT + "/post/" + id);
  };
  deleteComment = async (id) => {
    return await axios.delete(API_COMMENT + "/" + id, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  };
  getComment = async (id) => {
    return await axios.get(API_COMMENT + "/" + id + "/get", {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  };
  updateComment = async (id, object) => {
    return await axios.patch(API_COMMENT + "/" + id, object, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  };
}
