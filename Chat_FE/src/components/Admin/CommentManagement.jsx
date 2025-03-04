import { Table, Button, Space } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import "../../css/Admin/CommentManagement.scss";

const CommentManagement = () => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    axios.get("/api/comments").then((res) => setComments(res.data));
  }, []);

  const handleDelete = (commentId) => {
    axios.delete(`/api/comments/${commentId}`).then(() => {
      setComments(comments.filter(comment => comment._id !== commentId));
    });
  };

  const columns = [
    { title: "Nội dung", dataIndex: "content" },
    { title: "Người dùng", dataIndex: "userId" },
    { title: "Bài viết", dataIndex: "postId" },
    {
      title: "Thao tác",
      render: (_, record) => (
        <Space>
          <Button danger onClick={() => handleDelete(record._id)}>Xóa</Button>
        </Space>
      ),
    },
  ];

  return <Table className="comment-table" dataSource={comments} columns={columns} rowKey="_id" />;
};

export default CommentManagement;
