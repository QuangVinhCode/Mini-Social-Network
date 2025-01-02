import {
  MESSAGES_SET,
  MESSAGE_DELETE,
  MESSAGE_SET,
  MESSAGE_STATE_CLEAR,
} from "../actions/actionTypes";
const initialState = {
  message: {},
  messages: [],
};

const messageReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case MESSAGE_SET:
      return { ...state, message: payload };
    case MESSAGES_SET:
      return { ...state, messages: payload };
    case MESSAGE_DELETE:
      return {
        ...state,
        messages: state.messages.filter((item) => item._id !== payload),
      };
    case MESSAGE_STATE_CLEAR:
      return {
        message: {},
        messages: [],
      };
    default:
      return state;
  }
};

export default messageReducer;
