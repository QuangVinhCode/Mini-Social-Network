import {
  COMMENTS_SET,
  COMMENT_DELETE,
  COMMENT_SET,
  COMMENT_STATE_CLEAR,
} from "../actions/actionTypes";
const initialState = {
  comment: {},
  comments: [],
};

const commentReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case COMMENT_SET:
      return { ...state, comment: payload };
    case COMMENTS_SET:
      return { ...state, comments: payload };
    case COMMENT_DELETE:
      return {
        ...state,
        comments: state.comments.filter((item) => item._id !== payload),
      };
    case COMMENT_STATE_CLEAR:
      return {
        comment: {},
        comments: [],
      };
    default:
      return state;
  }
};

export default commentReducer;
