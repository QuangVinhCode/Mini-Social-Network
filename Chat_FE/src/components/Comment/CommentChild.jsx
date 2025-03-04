import React, { useState } from "react";
import "../../css/Comment/CommentChild.scss";
import TextArea from "antd/es/input/TextArea";
import { Button } from "antd";
import moment from "moment";
import PostService from "../../services/postService";
// Recursive Component
const CommentChild = ({
  comment,
  replyComment,
  handleReplyChange,
  postId,
  handlePostReply,
}) => {
  const [showReply, setShowReply] = useState(false);

  return (
    <div className="comment-box">
      <div className="comment-header">
        <img
          src={comment.userId.profile.avatar}
          alt="avatar"
          className="avatar"
        />
        <div>
          <b>{comment.userId.profile.name}</b>
          <span>
            {moment(comment.createdAt).isAfter(moment().subtract(1, "days"))
              ? moment(comment.createdAt).fromNow()
              : moment(comment.createdAt).format("DD/MM/YYYY HH:mm:ss")}
          </span>
        </div>
      </div>
      <div className="comment-content">
        <span>{comment.replyTo ? "Trả lời: " + comment.replyTo : ""}</span>
        <p>{comment.content}</p>
      </div>
      <div className="comment-actions">
        <Button
          type="primary"
          style={{ marginTop: "5px" }}
          onClick={() => {
            setShowReply(!showReply);
            handleReplyChange({ target: { value: "" } });
          }}
        >
          Trả lời
        </Button>
      </div>
      {showReply && (
        <div className="child-comments">
          {/* Danh sách bình luận con */}
          {comment.replies?.length > 0 &&
            comment.replies.map((reply) => (
              <CommentChild
                key={reply._id}
                comment={reply}
                postId={postId}
                handleReplyChange={handleReplyChange}
                replyComment={replyComment}
                handlePostReply={handlePostReply}
              />
            ))}

          {/* TextArea và Button */}
          <div className="reply-box">
            <TextArea
              rows={1}
              value={replyComment}
              onChange={handleReplyChange}
              placeholder="Nhập nội dung trả lời..."
            />
            <Button
              type="primary"
              onClick={() => handlePostReply(comment._id)}
              style={{ marginTop: "5px" }}
            >
              Gửi Trả Lời
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentChild;
