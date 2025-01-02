import {
  NOTIFICATION_SET,
  NOTIFICATIONS_SET,
  NOTIFICATION_STATE_CLEAR,
} from "../actions/actionTypes";
const initialState = {
  notification: {},
  notifications: [],
};

const notificationReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case NOTIFICATION_SET:
      return { ...state, notification: payload };
    case NOTIFICATIONS_SET:
      return { ...state, notifications: payload };
    case NOTIFICATION_STATE_CLEAR:
      return {
        notification: {},
        notifications: [],
      };
    default:
      return state;
  }
};

export default notificationReducer;
