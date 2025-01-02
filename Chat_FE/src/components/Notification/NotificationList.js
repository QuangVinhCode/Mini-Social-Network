import React, { Component } from "react";
import { Tabs } from "antd";
import "../../css/Notification/NotificationList.scss";
import withRouter from "../../helpers/withRouter";
import { connect } from "react-redux";
import {
  deleteAllNotification,
  getNotifications,
  markAllAsReadNotification,
  markAsReadNotification,
} from "../../redux/actions/notificationAction";
import { Link } from "react-router";
import withSocket from "../../helpers/withSocket";

class NotificationList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: [],
    };
  }

  initializeSocket = () => {
    this.props.socket.on("newNotification", (notification) => {
      this.setState((prevState) => ({
        notifications: [...prevState.notifications, notification],
      }));
      this.props.refreshNotifications();
    });
  };

  componentDidMount() {
    this.displayNotifications();
    this.initializeSocket();
  }

  displayNotifications = async () => {
    const userSession = sessionStorage.getItem("userSession")
      ? JSON.parse(sessionStorage.getItem("userSession"))
      : null;
    if (userSession) {
      const notifications = await this.props.getNotifications(userSession.id);
      this.setState({ notifications });
    }
  };

  renderNotifications = (isRead, notifications) => {
    const handleLinkClick = (id) => {
      this.props.markAsReadNotification(id);
      this.props.refreshNotifications();
      this.props.onCloseNotifications(false);
    };

    return notifications
      .filter(
        (notification) => isRead === null || notification.isRead === isRead
      )
      .map((notification) => {
        const linkTo =
          notification.type === "message"
            ? `/home/message/${notification.source}`
            : notification.type === "comment"
            ? `/home/post-details/${notification.source}`
            : "/";

        return (
          <Link
            to={linkTo}
            key={notification._id}
            onClick={() => handleLinkClick(notification._id)}
          >
            <p>{notification.message}</p>
          </Link>
        );
      });
  };

  markAllAsReadNotification = () => {
    const userSession = sessionStorage.getItem("userSession")
      ? JSON.parse(sessionStorage.getItem("userSession"))
      : null;

    if (userSession) {
      this.props.markAllAsReadNotification(userSession.id);

      this.setState((prevState) => ({
        notifications: prevState.notifications.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      }));
      this.props.refreshNotifications();
    }
  };

  deleteAllAsReadNotification = () => {
    const userSession = sessionStorage.getItem("userSession")
      ? JSON.parse(sessionStorage.getItem("userSession"))
      : null;
    if (userSession) {
      const data = this.props.deleteAllNotification(userSession.id);
      if (data) {
        this.setState({ notifications: [] });
        this.props.refreshNotifications();
      }
    }
  };

  render() {
    const { notifications } = this.state;

    const items = [
      {
        label: "Tất cả",
        key: "1",
        children: (
          <>
            <button
              className="notification__btn"
              onClick={this.deleteAllAsReadNotification}
            >
              Xóa tất cả
            </button>
            {this.renderNotifications(null, notifications)}
          </>
        ),
      },
      {
        label: "Chưa đọc",
        key: "2",
        children: (
          <>
            <button
              className="notification__btn"
              onClick={this.markAllAsReadNotification}
            >
              Đã đọc tất cả
            </button>
            {this.renderNotifications(false, notifications)}
          </>
        ),
      },
    ];

    return (
      <div className="notification__container">
        <Tabs defaultActiveKey="1" items={items} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  notifications: state.notificationReducer.notifications,
});

const mapDispatchToProps = {
  getNotifications,
  markAsReadNotification,
  markAllAsReadNotification,
  deleteAllNotification,
};

export default withSocket(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(NotificationList))
);
