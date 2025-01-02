import { combineReducers } from "redux";
import postReducer from "../redux/reducers/postReducer";
import commentReducer from "../redux/reducers/commentReducer";
import notificationReducer from "./reducers/notificationReducer";
import userReducer from "./reducers/userReducer";
const rootReducer = combineReducers({
  postReducer: postReducer,
  commentReducer: commentReducer,
  notificationReducer: notificationReducer,
  userReducer:userReducer,
});

export default rootReducer;
