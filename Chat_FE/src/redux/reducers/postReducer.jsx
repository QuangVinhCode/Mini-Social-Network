import {
  POSTS_SET,
  POST_DELETE,
  POST_LIKE,
  POST_SET,
  POST_STATE_CLEAR,
} from "../actions/actionTypes";
const initialState = {
  post: {},
  posts: [],
};

const postReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case POST_SET:
      return { ...state, post: payload };
    case POSTS_SET:
      return { ...state, posts: payload };
    case POST_LIKE:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === payload._id ? { ...post, likes: payload.likes } : post
        ),
        post: { ...state.post, likes: payload.likes },
      };
    case POST_DELETE:
      return {
        ...state,
        posts: state.posts.filter((item) => item._id !== payload),
      };
    case POST_STATE_CLEAR:
      return {
        post: {},
        posts: [],
      };
    default:
      return state;
  }
};

export default postReducer;
