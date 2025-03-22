import CommentService from "../../services/commentService";
import {
  COMMENTS_SET,
  COMMENT_DELETE,
  COMMENT_SET,
  COMMENT_STATE_CLEAR,
  COMMON_ERROR_SET,
  COMMON_LOADING_SET,
  COMMON_MESSAGE_SET,
} from "./actionTypes";

export const insertComment = (object) => async (dispatch) => {
  const service = new CommentService();
  try {
    console.log("Thêm bình luận");
    console.log(object);
    const response = await service.insertComment(object);

    if (response.status === 201) {
      dispatch({
        type: COMMON_MESSAGE_SET,
        payload: "Bình luận đã được thêm",
      });
      console.log(response);
      return response.data;
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
};

export const replyToComment = (object) => async (dispatch) => {
  const service = new CommentService();
  try {
    console.log("Trả lời bình luận");
    console.log(object);
    const response = await service.replyToComment(object);

    if (response.status === 201) {
      console.log(response);
      return response.data;
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
};

export const getComments = () => async (dispatch) => {
  const service = new CommentService();

  try {
    console.log("Danh sách bài viết");
    const response = await service.getComments();
    console.log(response);
    if (response.status === 200) {
      dispatch({
        type: COMMENTS_SET,
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

export const getCommentsByPost = (id) => async (dispatch) => {
  const service = new CommentService();

  try {
    console.log("Danh sách bình luận");
    const response = await service.getCommentsByPost(id);
    console.log(response);
    if (response.status === 200) {
      dispatch({
        type: COMMENTS_SET,
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
    dispatch({
      type: COMMON_ERROR_SET,
      payload: error.response.data
        ? error.response.data.message
        : error.message,
    });
  }
};

export const deleteComment = (id) => async (dispatch) => {
  const service = new CommentService();

  try {
    console.log("Xóa bình luận Action");

    dispatch({
      type: COMMON_LOADING_SET,
      payload: true,
    });

    const response = await service.deleteComment(id);
    console.log(response);
    if (response.status === 200) {
      dispatch({
        type: COMMENT_DELETE,
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
  dispatch({
    type: COMMON_LOADING_SET,
    payload: false,
  });
};

export const getComment = (id) => async (dispatch) => {
  const service = new CommentService();

  try {
    console.log("Lấy thông tin bình luận Action");

    dispatch({
      type: COMMON_LOADING_SET,
      payload: true,
    });

    const response = await service.getComment(id);
    console.log(response);
    if (response.status === 200) {
      dispatch({
        type: COMMENT_SET,
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
  dispatch({
    type: COMMON_LOADING_SET,
    payload: false,
  });
};

export const updateComment = (id, object, navigate) => async (dispatch) => {
  const service = new CommentService();

  try {
    console.log("Sửa bình luận");

    dispatch({
      type: COMMON_LOADING_SET,
      payload: true,
    });

    const response = await service.updateComment(id, object);

    if (response.status === 201) {
      dispatch({
        type: COMMENT_SET,
        payload: response.data,
      });
      dispatch({
        type: COMMON_MESSAGE_SET,
        payload: "bình luận đã được sửa",
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
  navigate("/dashboard/POST/list");
};

export const clearCommentState = () => (dispatch) => {
  dispatch({ type: COMMENT_STATE_CLEAR });
};

export const clearComment = () => (dispatch) => {
  dispatch({
    type: COMMENTS_SET,
    payload: {},
  });
};
