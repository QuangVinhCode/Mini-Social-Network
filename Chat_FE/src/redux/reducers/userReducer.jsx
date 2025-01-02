import {
  USERS_SET,
  USER_DELETE,
  USER_SET,
  USER_STATE_CLEAR,
} from "../actions/actionTypes";
const initialState = {
  user: {},
  users: [],
};

const userReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case USER_SET:
      return { ...state, user: payload };
    case USERS_SET:
      return { ...state, users: payload };
    case USER_DELETE:
      return {
        ...state,
        users: state.users.filter((item) => item._id !== payload),
      };
    case USER_STATE_CLEAR:
      return {
        user: {},
        users: [],
      };
    default:
      return state;
  }
};

export default userReducer;
