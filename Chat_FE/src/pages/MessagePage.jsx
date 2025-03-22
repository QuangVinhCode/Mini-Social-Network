import React, { Component } from "react";
import "../css/Chat/MessagePage.scss"; // Import CSS tùy chỉnh
import withRouter from "../helpers/withRouter";
import { connect } from "react-redux";
import {
  getLastMessage,
  getMessages,
  sendMessage,
} from "../redux/actions/messageAction";
import withSocket from "../helpers/withSocket";
import { AiOutlineArrowDown } from "react-icons/ai";
import MessageService from "../services/messageService";
import moment from "moment";
import { FaCheck } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { Avatar, Button, Input } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { IoMdSearch } from "react-icons/io";
class MessagePage extends Component {
  state = {
    chatList: [],
    selectedChat: 1,
    messages: [],
    newMessage: "",
    received: null,
    openBtn: false,
  };
  messageService = new MessageService();

  handleChatSelect = async (received) => {
    const userSession = sessionStorage.getItem("userSession")
      ? JSON.parse(sessionStorage.getItem("userSession"))
      : null;
    if (received) {
      const data =
        (await this.props.getMessages(userSession.id, received)) || [];
      const updatedMessages = await Promise.all(
        data.map(async (item) => {
          if (!item.isRead && item.receiverId === userSession.id) {
            // Mark the message as read
            await this.messageService.markMessage(item._id);
            this.props.socket.emit("messageRead", item);
            return { ...item, isRead: true }; // Update the message locally
          }
          return item;
        })
      );
      this.setState({ messages: updatedMessages, received });
    }
  };

  handleMessageChange = (event) => {
    this.setState({ newMessage: event.target.value });
  };

  handleSendMessage = async () => {
    const userSession = sessionStorage.getItem("userSession")
      ? JSON.parse(sessionStorage.getItem("userSession"))
      : null;
    const { received, newMessage } = this.state;
    if (newMessage.trim()) {
      const data = {
        senderId: userSession.id,
        receiverId: received,
        content: newMessage,
      };
      const message = await this.props.sendMessage(data);
      this.setState(
        (prevState) => ({
          messages: [...prevState.messages, message],
          newMessage: "",
        }),
        this.handleScrollToBottom
      );
    }
  };
  componentDidMount() {
    const userSession = sessionStorage.getItem("userSession")
      ? JSON.parse(sessionStorage.getItem("userSession"))
      : null;
    if (userSession) {
      this.getLastMessage();

      this.initializeSocket();
    } else {
      // this.props.router.navigate("/login");
      window.location.href = "/login";
    }
  }
  initializeSocket = () => {
    if (this.props.socket) {
      this.props.socket
        .off("newMessage")
        .off("messageRead")
        .on("newMessage", async (message) => {
          // Add the received message to the current conversation
          console.log("newMessage ", message);
          await this.messageService.markMessage(message._id);
          this.props.socket.emit("messageRead", message);
          this.setState((prevState) => ({
            messages: [...prevState.messages, { ...message, isRead: true }],
            openBtn: true,
          }));
        })
        .on("messageRead", (messageId) => {
          // Cập nhật trạng thái isRead của tin nhắn
          console.log("messageRead ", messageId);
          this.setState((prevState) => ({
            messages: prevState.messages.map((msg) =>
              msg._id === messageId ? { ...msg, isRead: true } : msg
            ),
          }));
        });
    }
  };
  getLastMessage = async () => {
    const userSession = sessionStorage.getItem("userSession")
      ? JSON.parse(sessionStorage.getItem("userSession"))
      : null;

    const list = await this.props.getLastMessage(userSession.id);
    console.log(list);
    if (this.props.router.params.id) {
      this.handleChatSelect(this.props.router.params.id);
      this.setState({ chatList: list, received: this.props.router.params.id });
    } else {
      this.handleChatSelect(list[0]?.withUser._id);
      this.setState({ chatList: list, received: list[0]?.withUser._id });
    }
  };
  handleScrollToBottom = () => {
    const chatMessages = document.querySelector(".chat__messages");
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the bottom
    }
    this.setState({ openBtn: false });
  };
  handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent the Enter key from creating a new line
      this.handleSendMessage(); // Trigger the send message function
    }
  };
  render() {
    const userSession = sessionStorage.getItem("userSession")
      ? JSON.parse(sessionStorage.getItem("userSession"))
      : null;
    const { chatList, selectedChat, messages, newMessage, openBtn, received } =
      this.state;
    return (
      <div className="chat__app">
        <div className="chat__sidebar">
          <div className="search__bar">
            <Input
              type="text"
              placeholder="Tìm kiếm trên Messenger"
              suffix={<IoMdSearch />}
            />
          </div>
          <div className="chat__list">
            {chatList.map((chat) => (
              <div
                key={chat.lastMessage._id}
                className={`chat__item ${
                  selectedChat === chat.lastMessage._id ? "active" : ""
                }`}
                onClick={() => this.handleChatSelect(chat.withUser._id)}
              >
                <div className="avatar">
                  <Avatar size={50} src={chat.withUser.avatar} alt="Avatar" />
                </div>
                <div className="chat__info">
                  <h5>{chat.withUser.name}</h5>
                  <p>{chat.lastMessage.content}</p>
                  <span>{chat.lastMessage.sentAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Box */}
        <div className="chat__box">
          <div className="chat__header">
            <h3>
              {received && (
                <Avatar
                  size={50}
                  src={
                    chatList.find((chat) => chat.withUser._id === received)
                      .withUser.avatar
                  }
                  alt="Avatar"
                />
              )}
              {chatList &&
                received &&
                chatList.find((chat) => chat.withUser._id === received).withUser
                  .name}
            </h3>
          </div>
          <div className="chat__messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`chat__message ${
                  message.senderId === userSession.id ? "sent" : "received"
                }`}
              >
                <p>{message.content}</p>

                <div className="chat__meta">
                  <span>
                    {moment(message.createdAt).isSame(moment(), "day")
                      ? moment(message.createdAt).format("HH:mm")
                      : moment(message.createdAt).format("DD/MM/YYYY")}
                  </span>
                  {message.isRead ? <FaEye /> : <FaCheck />}
                </div>
              </div>
            ))}
          </div>
          <div className="chat__input-container">
            <Input
              type="text"
              value={newMessage}
              onChange={this.handleMessageChange}
              onKeyDown={this.handleKeyDown}
              placeholder="Nhập tin nhắn"
              className="chat__input"
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={this.handleSendMessage}
              className="chat__send-button"
            >
              Gửi
            </Button>
          </div>
          {openBtn && (
            <button
              className="chat__messages--add"
              onClick={this.handleScrollToBottom}
            >
              Tin nhắn mới <AiOutlineArrowDown />
            </button>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
  getLastMessage,
  getMessages,
  sendMessage,
};

export default withSocket(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(MessagePage))
);
