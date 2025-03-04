import React, { Component } from "react";
import { connect } from "react-redux";
import withRouter from "../../helpers/withRouter.js";
import { getPosts, likePost } from "../../redux/actions/postAction.jsx";
import PostCard from "../Home/PostCard";
import "../../css/Home/HomeContent.scss";
class HomeContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: {},
    };
  }
  componentDidMount() {
    console.log("Did Mount Component HomeContent");

    this.props.getPosts();
  }

  handleLikePost = (id) => {
    const userSession = sessionStorage.getItem("userSession")
      ? JSON.parse(sessionStorage.getItem("userSession"))
      : null;
    if (userSession) {
      const data = {
        postId: id,
        userId: userSession.id,
      };
      this.props.likePost(data);
    } else {
      alert(" Please login to like post");
    }
  };

  render() {
    const { posts } = this.props;
    return (
      <div className="home__container">
        <div className="home__list">
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                handleLikePost={this.handleLikePost}
              />
            ))
          ) : (
            <p>Chưa đăng bài viết</p>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({ posts: state.postReducer.posts });

const mapDispatchToProps = {
  getPosts,
  likePost,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(HomeContent)
);
