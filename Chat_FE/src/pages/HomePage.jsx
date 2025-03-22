import React, { Component } from "react";
import withRouter from "../helpers/withRouter.js";
import { Layout, message } from "antd";
import Header from "../components/Home/Header.jsx";
import HomeContent from "../components/Home/HomeContent.jsx";
import PostDetails from "../components/Post/PostDetails.jsx";
import { Route, Routes } from "react-router";
import MessagePage from "./MessagePage.jsx";
import "../css/Home/HomePage.scss";
import Profile from "../components/User/Profile.jsx";
import { connect } from "react-redux";
import PostForm from "../components/Post/PostForm.jsx";
import { insertPost } from "../redux/actions/postAction.jsx";
import RegisterPage from "./RegisterPage.jsx";
import { setError, setMessage } from "../redux/actions/commonAction.jsx";

class HomePage extends Component {
  state = {
    post: {},
    open: false,
  };
  componentDidUpdate(prevProps) {
    
    if (this.props.message && this.props.message !== prevProps.message) {
      message.success(this.props.message); 
      this.props.router.dispatch(setMessage(""));
    }

    if (this.props.error && this.props.error !== prevProps.error) {
      message.error(this.props.error); 
      this.props.router.dispatch(setError(""));
    }
  }
  onOpen = () => {
    this.setState({ ...this.state, open: true });
  };

  onCancel = () => {
    this.setState({ ...this.state, open: false });
  };

  onExecute = (values) => {
    const userSession = sessionStorage.getItem("userSession")
      ? JSON.parse(sessionStorage.getItem("userSession"))
      : null;
    const data = {
      ...values,
      authorId: userSession.id,
    };
    this.props.insertPost(data);
    this.setState({ ...this.state, open: false });
  };
  render() {
    const { open, post } = this.state;
    return (
      <div className="container">
        <Header onOpen={this.onOpen} />
        <div className="container__chat">
          <Layout>
            <Routes>
              <Route path="/" element={<HomeContent />} />
              <Route path="/post-details/:id" element={<PostDetails />} />
              <Route path="/message/:id" element={<MessagePage />} />
              <Route path="/message" element={<MessagePage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </Layout>
        </div>

        <PostForm
          open={open}
          onCancel={this.onCancel}
          post={post}
          onExecute={this.onExecute}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  message: state.commonReducer.message,
  error: state.commonReducer.error
});

const mapDispatchToProps = {
  insertPost,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(HomePage)
);
