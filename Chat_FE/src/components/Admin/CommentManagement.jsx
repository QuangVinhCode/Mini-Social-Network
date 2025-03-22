import React, { Component } from "react";
import { Table, Button, Space, Modal } from "antd";
import "../../css/Admin/CommentManagement.scss";
import withRouter from "../../helpers/withRouter";
import { connect } from "react-redux";
import { deleteComment, getComments } from "../../redux/actions/commentAction";
import { ExclamationCircleOutlined } from "@ant-design/icons";

class CommentManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
    };
  }

  componentDidMount() {
   this.props.getComments();
  }
  openDeleteConfirmModal = (object) => {
    const message = "Bạn có chắt chắn muốn xóa bình luận " + object.username;
    Modal.confirm({
      title: "Xác nhận",
      icon: <ExclamationCircleOutlined />,
      content: message,
      onOk: () => this.handleDelete(object._id),
      okText: "Xóa",
      cancelText: "Hủy",
    });
  };
  handleDelete = (id) => {
    this.props.deleteComment(id)
  };

  render() {
    const columns = [
      { title: "Nội dung", dataIndex: "content" },
      { title: "Người dùng", dataIndex: "userId" },
      { title: "Bài viết", dataIndex: "postId" },
      {
        title: "Thao tác",
        render: (_, record) => (
          <Space>
            <Button danger onClick={() => this.openDeleteConfirmModal(record)}>Xóa</Button>
          </Space>
        ),
      },
    ];

    return <Table className="comment-table" dataSource={this.props.comments} columns={columns} rowKey="_id" />;
  }
}

const mapStateToProps = (state) => ({
  comments: state.commentReducer.comments,
});

const mapDispatchToProps = {
  getComments,
  deleteComment,
};

export default withRouter(
  connect (mapStateToProps, mapDispatchToProps)(CommentManagement)
);
