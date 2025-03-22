import React, { Component } from "react";
import { Input, Button } from "antd";
import "../../css/Comment/CommentList.scss";
import withRouter from "../../helpers/withRouter";
import { connect } from "react-redux";
import {
  getCommentsByPost,
  insertComment,
  replyToComment,
} from "../../redux/actions/commentAction";
import CommentChild from "../Comment/CommentChild";
import { setError } from "../../redux/actions/commonAction";

const { TextArea } = Input;

class CommentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newComment: "",
      replyComment: "",
      comments: [],
    };
  }

  componentDidMount() {
    this.getListComment();
  }

  getListComment = async () => {
    const data = await this.props.getCommentsByPost(this.props.id);
    const comments = this.transformComments(data);
    console.log("transformComments ");
    console.log(comments);
    this.setState({ comments: comments });
  };
  handleCommentChange = (e) => {
    this.setState({ newComment: e.target.value });
  };

  handlePostComment = async () => {
    const { newComment, comments } = this.state;
    const userSession = sessionStorage.getItem("userSession")
      ? JSON.parse(sessionStorage.getItem("userSession"))
      : null;
    if (!newComment.trim()) return;
    if (userSession) {
      const comment = await this.props.insertComment({
        content: newComment,
        userId: userSession.id,
        postId: this.props.id,
      });
      console.log(comment);
      this.setState({
        comments: [...comments, { ...comment, replies: [], replyTo: null }],
        newComment: "",
      });
    } else {
      this.props.router.dispatch(setError("Yêu cầu đăng nhập"));
    }
  };

  handleReplyChange = (e) => {
    this.setState({ replyComment: e.target.value });
  };

  handlePostReply = async (parentId) => {
    const userSession = sessionStorage.getItem("userSession")
      ? JSON.parse(sessionStorage.getItem("userSession"))
      : null;
    const { replyComment, comments } = this.state;
    console.log("replyComment :" + replyComment);
    if (!replyComment || !replyComment.trim()) return;
    try {
      const reply = await this.props.replyToComment({
        content: replyComment,
        parentCommentId: parentId,
        postId: this.props.id,
        userId: userSession.id,
      });
      console.log("reply");
      console.log(reply);
      comments.forEach((comment) => {
        if (comment._id === reply.parentComment) {
          comment.replies.push(reply);
        }
      });
      console.log(comments);
      this.setState({ comments: comments, replyComment: "" });
    } catch (error) {
      console.error("Error posting reply", error);
    }
  };

  transformComments(comments) {
    const commentMap = {};
    const result = [];

    // Tạo map với key là comment ID
    comments.forEach((comment) => {
      commentMap[comment._id] = { ...comment, replies: [], replyTo: null };
    });

    // Gán các comment con vào comment cha
    comments.forEach((comment) => {
      if (comment.parentComment) {
        const parent = commentMap[comment.parentComment];
        if (parent) {
          parent.replies.push({
            ...commentMap[comment._id],
            replyTo: parent.userId.username, // Dấu nhận biết trả lời bình luận nào
          });
          comments.forEach((item) => {
            if (comment._id === item.parentComment) {
              parent.replies.push({
                ...commentMap[item._id],
                replyTo: parent.userId.username, // Dấu nhận biết trả lời bình luận nào
              });
            }
          });
        }
      } else {
        // Là comment cha
        result.push(commentMap[comment._id]);
      }
    });

    return result;
  }
  handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Ngăn xuống dòng khi nhấn Enter
      this.handlePostComment();
    }
  };
  render() {
    const { newComment, replyComment, comments } = this.state;
    // Tạo cấu trúc dữ liệu với bình luận cha và bình luận con
    this.transformComments(comments);
    return (
      <div className="post-comment__list">
        <div className="post-comment__box">
          {comments > 0 ? (comments.map((comment) => (
            <CommentChild
              key={comment._id}
              comment={comment}
              handleReplyChange={this.handleReplyChange}
              postId={this.props.id}
              replyComment={replyComment}
              handlePostReply={this.handlePostReply}
            />
          ))) : (<p>Chưa có bình luận</p>)}
        </div>

        <div className="post-comment__add">
          <TextArea
            className="post-comment__input"
            rows={1}
            value={newComment}
            onChange={this.handleCommentChange}
            onPressEnter={this.handleKeyPress}
            placeholder="Nhập nội dung bình luận..."
          />
          <Button
            className="post-comment__btn"
            type="primary"
            onClick={this.handlePostComment}
            style={{ marginTop: "5px" }}
          >
            Đăng
          </Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
  getCommentsByPost,
  insertComment,
  replyToComment,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CommentList)
);
