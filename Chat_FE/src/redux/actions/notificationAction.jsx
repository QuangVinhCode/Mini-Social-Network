import NotificationService from "../../services/notificationService";
import { COMMON_ERROR_SET, NOTIFICATION_STATE_CLEAR } from "./actionTypes";

export const getNotifications = (id) => async (dispatch) => {
  const service = new NotificationService();
  try {
    console.log("Danh sách thông báo");

    const response = await service.getNotifications(id);
    console.log(response);
    if (response.status === 200) {
      return response.data;
    } else {
      dispatch({
        type: COMMON_ERROR_SET,
        payload: response.message,
      });
    }
  } catch (error) {
    console.log("error", error);
  }
};

export const getReadNotifications = (id) => async (dispatch) => {
  const service = new NotificationService();

  try {
    console.log("Danh sách thông báo");

    const response = await service.getReadNotifications(id);
    console.log(response);
    if (response.status === 200) {
      return response.data;
    } else {
      dispatch({
        type: COMMON_ERROR_SET,
        payload: response.message,
      });
    }
  } catch (error) {
    console.log("error", error);
  }
};

export const getUnreadNotifications = (id) => async (dispatch) => {
  const service = new NotificationService();

  try {
    console.log("Danh sách thông báo");

    const response = await service.getUnreadNotifications(id);
    console.log(response);
    if (response.status === 200) {
      return response.data;
    } else {
      dispatch({
        type: COMMON_ERROR_SET,
        payload: response.message,
      });
    }
  } catch (error) {
    console.log("error", error);
  }
};

export const countUnreadNotifications = (id) => async (dispatch) => {
  const service = new NotificationService();

  try {
    console.log("Số lượng thông báo");
    const response = await service.countUnreadNotifications(id);
    console.log(response);
    if (response.status === 200) {
      return response.data;
    } else {
      dispatch({
        type: COMMON_ERROR_SET,
        payload: response.message,
      });
    }
  } catch (error) {
    console.log("error", error);
  }
};

export const markAsReadNotification = (id) => async (dispatch) => {
  const service = new NotificationService();

  try {
    console.log("Đã xem thông báo");
    const response = await service.markAsReadNotification(id);
    console.log(response);
    if (response.status === 200) {
      return response.data;
    } else {
      dispatch({
        type: COMMON_ERROR_SET,
        payload: response.message,
      });
    }
  } catch (error) {
    console.log("error", error);
  }
};

export const markAllAsReadNotification = (id) => async (dispatch) => {
  const service = new NotificationService();

  try {
    console.log("Đã xem thông báo");
    const response = await service.markAllAskReadNotification(id);
    console.log(response);
    if (response.status === 200) {
      return response.data;
    } else {
      console.log(response.message);
    }
  } catch (error) {
    console.log(error);
  }
};

export const deleteAllNotification = (id) => async (dispatch) => {
  const service = new NotificationService();
  console.log("Xoá tất cả thông báo");
  try {
    const response = await service.deleteAllNotification(id);
    if (response.status === 200) {
      dispatch({
        type: NOTIFICATION_STATE_CLEAR,
      });
      return response.data;
    }
  } catch (error) {
    console.log(error);
  }
};
