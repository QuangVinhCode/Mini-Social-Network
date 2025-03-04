/* eslint-disable no-dupe-class-members */
import React, { Component } from "react";
import "../../css/Post/PostDetails.scss";
import withRouter from "../../helpers/withRouter.js";
import { connect } from "react-redux";
import { getPost, likePost } from "../../redux/actions/postAction.jsx";
import ImageCarousel from "./ImageCarousel.jsx";
import "../../css/Post/ImageCarousel.scss"; // SCSS tùy chỉnh của bạn
import CommentList from "../Comment/CommentList.jsx";
import { Avatar, Button, Divider } from "antd";
import PostService from "../../services/postService.jsx";
import { AiOutlineLike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
class PostDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: {},
      like: false,
    };
    this.postService = new PostService();
  }
  settings = {
    dots: true, // Hiển thị chấm điều hướng
    infinite: true, // Vòng lặp vô tận
    speed: 500, // Tốc độ chuyển đổi (ms)
    slidesToShow: 1, // Số slide hiển thị mỗi lần
    slidesToScroll: 1, // Số slide cuộn mỗi lần
    arrows: true, // Hiển thị nút điều hướng
  };
  componentDidMount() {
    this.props.getPost(this.props.router.params.id);
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

  componentWillMount() {
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
  render() {
    const { post } = this.props;
    const { like } = this.state;
    // Kiểm tra xem post có chứa dữ liệu hợp lệ không
    if (!post || !post.images) {
      return <div>Đang tải dữ liệu bài viết...</div>; // Trả về thông báo khi dữ liệu chưa có
    }

    return (
      <div className="post__container">
        <div className="post__img">
          <ImageCarousel images={post.images} />
        </div>
        <div className="post__content">
          <ul>
            <l1>
              <Avatar size={54} src={post.authorId.profile.avatar} />
              &nbsp;
              <strong>{post.authorId.profile.name}</strong>
            </l1>
            <Divider />
            <l1>
              <p>{post.content}</p>
            </l1>
          </ul>
          <div className="post__footer">
            <div className="post__footer--item">
              <span> {post.likes.length} lượt</span>
              <Button
                className={`post__footer--btn ${like ? "checkLike" : ""}`}
                icon={<AiOutlineLike />}
                onClick={() => {
                  this.handleLikePost(post._id);
                  this.setState({ like: !like });
                }}
              >
                Thích
              </Button>
            </div>
            <div className="post__footer--item">
              <div>
                <FaRegComment /> Bình luận
              </div>
            </div>
            <div className="post__footer--item">Chia sẻ</div>
          </div>
          <CommentList id={post._id} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  post: state.postReducer.post,
});

const mapDispatchToProps = {
  getPost,
  likePost,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PostDetails)
);
