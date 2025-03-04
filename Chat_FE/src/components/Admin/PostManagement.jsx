import React, { Component } from "react";
import { Table, Button, Space, Popconfirm, Modal } from "antd";
import "../../css/Admin/PostManagement.scss";
import withRouter from "../../helpers/withRouter";
import { connect } from "react-redux";
import { getPosts, deletePost } from "../../redux/actions/postAction";
import { ExclamationCircleOutlined } from "@ant-design/icons";
class PostManagement extends Component {
  state = {
    posts: [],
  };

  componentDidMount() {
    this.props.getPosts();
  }

  openDeleteConfirmModal = (object) => {
    const message = "Bạn có chắt chắn muốn xóa tài khoản " + object.username;
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
    this.props.deleteUser(id);
  };
  openDetails = (id) => {
    this.props.router.navigate("/home/post-details/" + id);
  }
  render() {
    const columns = [
      { title: "Nội dung", dataIndex: "content" },
      { title: "Tác giả", dataIndex: ["authorId", "username"] },
      {
        title: "Thao tác",
        render: (_, record) => (
          <Space>
           <Button onClick={() => this.openDetails(record._id)}>
              Chi tiết
            </Button>
            <Button danger onClick={() => this.handleDelete(record)}>
              Xóa
            </Button>
          </Space>
        ),
      },
    ];

    return (
      <Table
        className="post-table"
        dataSource={this.props.posts}
        columns={columns}
        rowKey="_id"
      />
    );
  }
}

const mapStateToProps = (state) => ({
  posts: state.postReducer.posts,
});

const mapDispatchToProps = {
  getPosts,
  deletePost,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PostManagement)
);
