import axios from "axios";
import { API_POST } from "./constant";

export default class PostService {
  getToken = () => {
    const jwtToken = sessionStorage.getItem("userSession");
    const sessionToken = jwtToken ? JSON.parse(jwtToken) : null;
    return sessionToken.token;
  };

  insertPost = async (object) => {
    let formData = new FormData();

    formData.append("content", object.content);
    formData.append("authorId", object.authorId);
    object.images.fileList.forEach((file, index) => {
      formData.append("images", file.originFileObj);
    });
    console.log(formData);
    return await axios.post(API_POST, formData, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  };
  getPosts = async () => {
    return await axios.get(API_POST);
  };
  deletePost = async (id) => {
    return await axios.delete(API_POST + "/" + id, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  };
  getPost = async (id) => {
    return await axios.get(API_POST + "/" + id);
  };
  updatePost = async (id, object) => {
    return await axios.patch(API_POST + "/" + id, object, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  };

  likePost = async (object) => {
    return await axios.patch(API_POST + "/like", object, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  };

  checkLike = async (postId, userId) => {
    return await axios.get(API_POST + "/like/" + postId + "/" + userId);
  };
}
