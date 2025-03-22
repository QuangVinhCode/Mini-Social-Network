import React, { Component } from "react";
import { Avatar, Button, Input } from "antd";
import "../../css/Home/PostCard.scss";
import PostService from "../../services/postService";
import withRouter from "../../helpers/withRouter.js";
import { connect } from "react-redux";
import {
  getCommentsByPost,
  insertComment,
  clearComment,
} from "../../redux/actions/commentAction.jsx";
import { AiOutlineLike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import ImageGrid from "../Post/ImageGrid.jsx";
import { setError } from "../../redux/actions/commonAction.jsx";

class PostCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: {},
      comment_content: "",
      comments: [],
      like: false,
    };
    this.postService = new PostService();
  }

  async displayComments() {
    const { post, getCommentsByPost } = this.props;
    try {
      const comments = await getCommentsByPost(post._id);
      if (comments) {
        this.setState({ comments });
      }
    } catch (error) {
      console.error("Lỗi khi tải bình luận:", error);
    }
  }

  componentDidMount() {
    this.displayComments();
    this.handleCheckLike();
  }

  handleCheckLike = async () => {
    const userSession = sessionStorage.getItem("userSession")
      ? JSON.parse(sessionStorage.getItem("userSession"))
      : null;
    const { post } = this.props;
    if (userSession) {
      const like = await this.postService.checkLike(post._id, userSession.id);
      this.setState({ like: like.data });
    }
  };

  sendComment = async () => {
    const userSession = sessionStorage.getItem("userSession")
      ? JSON.parse(sessionStorage.getItem("userSession"))
      : null;
    const { comment_content } = this.state;
    const { post } = this.props;
    if (userSession)
    {
      const comment = {
        postId: post._id,
        userId: userSession.id,
        content: comment_content,
      };
      const flag = await this.props.insertComment(comment);
      if (flag) {
        this.setState({ comment_content: "" });
        this.displayComments();
      }
    }else{
      this.props.router.dispatch(setError("Yêu cầu đăng nhập"));
    }
   
  };

  seeDetails = (id) => {
    this.props.router.navigate("/home/post-details/" + id);
  };

  render() {
    const { post } = this.props;
    const { comments, like } = this.state;
    return (
      <div className="post-card">
        <div className="post-card__header">
          <h3 className="post-card__title">
            <Avatar size={64} src={post.authorId.profile.avatar} />
            {post.authorId.profile.name}
          </h3>
        </div>
        <p className="post-card__content">{post.content}</p>

        <div
          onClick={() => this.seeDetails(post._id)}
          className="post-card__images"
        >
         <ImageGrid images={post.images} />
        </div>

        <div className="post-card__footer">
          <div className="post-card__footer--item">
            <span>{post.likes.length}</span>
            <Button
              className={`post-card__footer--btn ${like ? "checkLike" : ""}`}
              icon={<AiOutlineLike />}
              onClick={() => {
                this.props.handleLikePost(post._id);
                this.setState({ like: !like });
              }}
            >
              Thích
            </Button>
          </div>
          <div className="post-card__footer--item">
            <span>{comments?.length}</span>
            <Button className="post-card__footer--btn" icon={<FaRegComment />}>
              Bình luận
            </Button>
          </div>
          <div className="post-card__footer--item">Chia sẻ</div>
        </div>
        {comments.length > 0 && (
          <div className="post-card__comments">
            {comments.slice(0, 3).map((comment, index) => {
              // Chuyển đổi thời gian sang múi giờ Việt Nam
              const date = new Date(comment.createdAt);
              const formattedDate = new Intl.DateTimeFormat("vi-VN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                timeZone: "Asia/Ho_Chi_Minh",
              }).format(date);

              return (
                <div key={index} className="post-card__comment">
                  <strong>
                    {comment.userId.username}: {formattedDate}
                  </strong>
                  <p>{comment.content}</p>
                </div>
              );
            })}
            {comments.length > 3 && (
              <div className="post-card__scroll-text">Xem thêm bình luận</div>
            )}
          </div>
        )}

        {/* Khung nhập bình luận */}
        <div className="post-card__comment-input">
          <Input
            type="text"
            placeholder="Nhập bình luận..."
            value={this.state.comment_content}
            onChange={(e) => {
              this.setState({ comment_content: e.target.value });
            }}
          />
          <Button onClick={this.sendComment}>Gửi</Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  comments: state.commentReducer.comments,
  comment: state.commentReducer.comment,
});

const mapDispatchToProps = {
  insertComment,
  getCommentsByPost,
  clearComment,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PostCard)
);
