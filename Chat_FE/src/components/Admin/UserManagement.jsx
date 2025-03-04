import React, { Component } from "react";
import { Table, Button, Space, Modal } from "antd";
import "../../css/Admin/UserManagement.scss";
import { connect } from "react-redux";
import withRouter from "../../helpers/withRouter";
import { getUsers, deleteUser } from "../../redux/actions/userAction";
import { ExclamationCircleOutlined } from "@ant-design/icons";
class UserManagement extends Component {
  state = {
    users: [],
  };

  componentDidMount() {
    this.props.getUsers();
    this.setState({ users: this.props.users });
  }

  handleEdit = (id) => {
    console.log("Edit user:", id);
  };
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

  render() {
    const columns = [
      { title: "Username", dataIndex: "username" },
      { title: "Email", dataIndex: "email" },
      { title: "Role", dataIndex: "role" },
      {
        title: "Thao tác",
        render: (_, record) => (
          <Space>
            <Button danger onClick={() => this.openDeleteConfirmModal(record)}>
              Xóa
            </Button>
          </Space>
        ),
      },
    ];
    const data = this.props.users;
    return (
      <Table
        className="user-table"
        dataSource={data}
        columns={columns}
        rowKey="_id"
      />
    );
  }
}

const mapStateToProps = (state) => ({
  users: state.userReducer.users,
});

const mapDispatchToProps = {
  getUsers,
  deleteUser,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(UserManagement)
);
