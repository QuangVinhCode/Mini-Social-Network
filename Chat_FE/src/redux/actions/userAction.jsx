import UserService from "../../services/userService";
import {
  USERS_SET,
  USER_DELETE,
  USER_SET,
  USER_STATE_CLEAR,
  COMMON_ERROR_SET,
  COMMON_MESSAGE_SET,
} from "./actionTypes";

export const insertUser = (object, navigate) => async (dispatch) => {
  const service = new UserService();
  try {
    console.log("Thêm Người dùng");
    const response = await service.insertUser(object);

    if (response.status === 201) {
      dispatch({
        type: USER_SET,
        payload: response.data,
      });
      dispatch({
        type: COMMON_MESSAGE_SET,
        payload: "Người dùng đã được thêm",
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
  navigate("/login");
};

export const loginUser = (object) => async (dispatch) => {
  const service = new UserService();

  try {
    console.log("Đăng nhập người dùng");
    const response = await service.loginUser(object);

    if (response.status === 200) {
      const userSession = response.data;
      sessionStorage.setItem("userSession", JSON.stringify(userSession));

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

export const registerUser = (object, navigate) => async (dispatch) => {
  const service = new UserService();

  try {
    console.log("Đăng ký người dùng");
    const response = await service.registerUser(object);

    if (response.status === 201) {
      dispatch({
        type: COMMON_MESSAGE_SET,
        payload: "Đăng ký thành công",
      });
      navigate("/login");
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

export const getUsers = () => async (dispatch) => {
  const service = new UserService();

  try {
    console.log("Danh sách người dùng");
    const response = await service.getUsers();
    console.log(response);
    if (response.status === 200) {
      dispatch({
        type: USERS_SET,
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

export const getUsersByPost = (id) => async (dispatch) => {
  const service = new UserService();

  try {
    console.log("Danh sách Người dùng");
    const response = await service.getUsersByPost(id);
    if (response.status === 200) {
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

export const deleteUser = (id) => async (dispatch) => {
  const service = new UserService();

  try {
    console.log("Xóa Người dùng Action");

    const response = await service.deleteUser(id);
    console.log(response);
    if (response.status === 200) {
      dispatch({
        type: USER_DELETE,
        payload: id,
      });
      dispatch({
        type: COMMON_MESSAGE_SET,
        payload: response.data.message,
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

export const getUser = (id) => async (dispatch) => {
  const service = new UserService();

  try {
    console.log("Lấy thông tin Người dùng Action");

    const response = await service.getUser(id);
    console.log(response);
    if (response.status === 200) {
      dispatch({
        type: USER_SET,
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
  }
};

export const updateUser = (id, object) => async (dispatch) => {
  const service = new UserService();

  try {
    console.log("Sửa Người dùng");

    const response = await service.updateUser(id, object);

    if (response.status === 201) {
      dispatch({
        type: USER_SET,
        payload: response.data.user,
      });
      dispatch({
        type: COMMON_MESSAGE_SET,
        payload: "Người dùng đã được sửa",
      });
      console.log(response.data);
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

export const clearUserState = () => (dispatch) => {
  dispatch({ type: USER_STATE_CLEAR });
};

export const clearUser = () => (dispatch) => {
  dispatch({
    type: USERS_SET,
    payload: {},
  });
};
