import React, { Component } from "react";
import withRouter from "../helpers/withRouter.js";
import { Layout } from "antd";
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

class HomePage extends Component {
  state = {
    post: {},
    open: false,
  };
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

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
  insertPost,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(HomePage)
);
