import { Table, Button, Space } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import "../../css/Admin/MessageManagement.scss";

const MessageManagement = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios.get("/api/messages").then((res) => setMessages(res.data));
  }, []);

  const handleDelete = (messageId) => {
    axios.delete(`/api/messages/${messageId}`).then(() => {
      setMessages(messages.filter(message => message._id !== messageId));
    });
  };

  const columns = [
    { title: "Người gửi", dataIndex: "senderId" },
    { title: "Người nhận", dataIndex: "receiverId" },
    { title: "Nội dung", dataIndex: "content" },
    {
      title: "Thao tác",
      render: (_, record) => (
        <Space>
          <Button danger onClick={() => handleDelete(record._id)}>Xóa</Button>
        </Space>
      ),
    },
  ];

  return <Table className="message-table" dataSource={messages} columns={columns} rowKey="_id" />;
};

export default MessageManagement;
