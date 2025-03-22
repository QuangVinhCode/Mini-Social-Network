import React, { Component } from "react";
import { Table, Button, Space } from "antd";
import axios from "axios";
import "../../css/Admin/MessageManagement.scss";
import { connect } from "react-redux";
import withRouter from "../../helpers/withRouter";

class MessageManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    axios.get("/api/messages").then((res) => {
      this.setState({ messages: res.data });
    });
  }

  handleDelete = (messageId) => {
    axios.delete(`/api/messages/${messageId}`).then(() => {
      this.setState((prevState) => ({
        messages: prevState.messages.filter(
          (message) => message._id !== messageId
        ),
      }));
    });
  };

  render() {
    const columns = [
      { title: "Người gửi", dataIndex: "senderId" },
      { title: "Người nhận", dataIndex: "receiverId" },
      { title: "Nội dung", dataIndex: "content" },
      {
        title: "Thao tác",
        render: (_, record) => (
          <Space>
            <Button danger onClick={() => this.handleDelete(record._id)}>
              Xóa
            </Button>
          </Space>
        ),
      },
    ];

    return (
      <Table
        className="message-table"
        dataSource={this.state.messages}
        columns={columns}
        rowKey="_id"
      />
    );
  }
}

const mapStateToProps = (state) => ({
  messages: state.messageReducer.messages,
});

const mapDispatchToProps = {
  
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(MessageManagement)
);
