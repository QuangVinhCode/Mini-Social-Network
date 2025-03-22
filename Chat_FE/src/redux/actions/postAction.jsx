import PostService from "../../services/postService";
import {
  POSTS_SET,
  POST_DELETE,
  POST_SET,
  POST_STATE_CLEAR,
  COMMON_ERROR_SET,
  COMMON_LOADING_SET,
  COMMON_MESSAGE_SET,
  POST_LIKE,
} from "./actionTypes";

export const insertPost = (object) => async (dispatch) => {
  const service = new PostService();

  try {
    console.log("Thêm bài viết");
    const response = await service.insertPost(object);
    if (response.status === 201) {
      dispatch({
        type: POST_SET,
        payload: response.data,
      });
      dispatch({
        type: COMMON_MESSAGE_SET,
        payload: "Bài viết đã được thêm",
      });
    } else {
      dispatch({
        type: COMMON_ERROR_SET,
        payload: response.message,
      });
    }
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

export const likePost = (object) => async (dispatch) => {
  const service = new PostService();

  try {
    console.log("Like bài viết");
    console.log(object)
    const response = await service.likePost(object);
    if (response.status === 201) {
      dispatch({
        type: POST_LIKE,
        payload: response.data,
      });
    } else {
      dispatch({
        type: COMMON_ERROR_SET,
        payload: response.message,
      });
    }
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

export const getPosts = () => async (dispatch) => {
  const service = new PostService();

  try {
    console.log("Danh sách bài viết");
    const response = await service.getPosts();
    console.log(response);
    if (response.status === 200) {
      dispatch({
        type: POSTS_SET,
        payload: response.data,
      });
    } else {
      dispatch({
        type: COMMON_ERROR_SET,
        payload: response.message,
      });
    }
  } catch (error) {
    dispatch({
      type: COMMON_ERROR_SET,
      payload: error.response.data
        ? error.response.data.message
        : error.message,
    });
  }
};

export const deletePost = (id) => async (dispatch) => {
  const service = new PostService();

  try {
    console.log("Xóa bài viết Action");
    const response = await service.deletePost(id);
    console.log(response);
    if (response.status === 200) {
      dispatch({
        type: POST_DELETE,
        payload: id,
      });
      dispatch({
        type: COMMON_MESSAGE_SET,
        payload: response.data,
      });
    } else {
      dispatch({
        type: COMMON_ERROR_SET,
        payload: response.message,
      });
    }
  } catch (error) {
    console.log(error);
    dispatch({
      type: COMMON_ERROR_SET,
      payload: error.response.data
        ? error.response.data.message
        : error.message,
    });
  }
};

export const getPost = (id) => async (dispatch) => {
  const service = new PostService();

  try {
    console.log("Lấy thông tin bài viết Action");

    const response = await service.getPost(id);
    console.log(response);
    if (response.status === 200) {
      dispatch({
        type: POST_SET,
        payload: response.data,
      });
      return response.data;
    } else {
      dispatch({
        type: COMMON_ERROR_SET,
        payload: response.message,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const updatePost = (id, object) => async (dispatch) => {
  const service = new PostService();

  try {
    console.log("Sửa bài viết");

    dispatch({
      type: COMMON_LOADING_SET,
      payload: true,
    });

    const response = await service.updatePost(id, object);

    if (response.status === 201) {
      dispatch({
        type: POST_SET,
        payload: response.data,
      });
      dispatch({
        type: COMMON_MESSAGE_SET,
        payload: "bài viết đã được sửa",
      });
    } else {
      dispatch({
        type: COMMON_ERROR_SET,
        payload: response.message,
      });
    }
    console.log(response);
  } catch (error) {
    dispatch({
      type: COMMON_ERROR_SET,
      payload: error.response.data
        ? error.response.data.message
        : error.message,
    });
  }
  dispatch({
    type: COMMON_LOADING_SET,
    payload: false,
  });
};

export const clearPostState = () => (dispatch) => {
  dispatch({ type: POST_STATE_CLEAR });
};

export const clearPost = () => (dispatch) => {
  dispatch({
    type: POST_SET,
    payload: {},
  });
};
