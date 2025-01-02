import React, { Component } from "react";
import { Avatar, Badge, Input, Tooltip } from "antd"; // Import Tooltip
import { connect } from "react-redux";
import withRouter from "../../helpers/withRouter.js";
import "../../css/Home/Header.scss";
import logo from "../../logo.png";
import { FaMessage } from "react-icons/fa6";
import { IoIosAddCircle, IoMdNotifications } from "react-icons/io";
import { CiLogin } from "react-icons/ci";
import { Link } from "react-router";
import NotificationList from "../Notification/NotificationList.js";
import { countUnreadNotifications } from "../../redux/actions/notificationAction.jsx";
import { getUser } from "../../redux/actions/userAction.jsx";
import PostService from "../../services/postService.jsx";
const { Search } = Input;
class Header extends Component {
  state = {
    isNotificationVisible: false, // Trạng thái thông báo
    countNotification: 0,
  };

  toggleNotifications = () => {
    this.setState({ isNotificationVisible: !this.state.isNotificationVisible });
  };

  // Hàm ẩn thông báo khi click ra ngoài
  handleClickOutside = (event) => {
    // Kiểm tra xem click có phải bên ngoài NotificationList không
    if (this.notificationRef && !this.notificationRef.contains(event.target)) {
      this.setState({ isNotificationVisible: false });
    }
  };

  logoutUser = () => {
    // Lấy giá trị sessionUser từ sessionStorage
    const userSession = sessionStorage.getItem("userSession")
      ? JSON.parse(sessionStorage.getItem("userSession"))
      : null;

    // Xóa userSession khỏi sessionStorage nếu nó tồn tại
    if (userSession) {
      sessionStorage.removeItem("userSession");
      console.log("User session has been removed");
      this.props.router.navigate("/");
    }
  };

  componentDidMount() {
    // Lắng nghe sự kiện click ra ngoài khi component đã render xong
    document.addEventListener("mousedown", this.handleClickOutside);

    this.countUnreadNotifications();
  }

  countUnreadNotifications = async () => {
    console.log("Cập nhật số thông báo");
    const userSession = sessionStorage.getItem("userSession")
      ? JSON.parse(sessionStorage.getItem("userSession"))
      : null;

    if (userSession) {
      const countNotification = await this.props.countUnreadNotifications(
        userSession.id
      );
      this.props.getUser(userSession.id);
      this.setState({ countNotification });
    }
  };

  componentWillUnmount() {
    // Xóa sự kiện khi component bị hủy
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  render() {
    const userSession = sessionStorage.getItem("userSession")
      ? JSON.parse(sessionStorage.getItem("userSession"))
      : null;
    const { user } = this.props;
    const img = user.profile?.avatar
      ? PostService.getImageDetails(user.profile?.avatar)
      : null;
    const { countNotification, isNotificationVisible } = this.state;
    return (
      <div className="header__container">
        <div className="header__logo">
          <div className="header__logo--item">
            <Link to="/">
              <Avatar className="avatar-custom" size={60} src={logo} />
            </Link>
          </div>
          <div className="header__logo--item">
            <Search className="header__logo--search" placeholder="Tìm kiếm..." />
          </div>
        </div>
        <div className="header__item">
            {userSession ? (
              <>
                <div className="header__list--item">
                  <Tooltip
                    title="Đăng bài viết"
                    onClick={() => this.props.onOpen()}
                  >
                    <div className="header__badge">
                      <IoIosAddCircle />
                    </div>
                  </Tooltip>
                </div>
                <div className="header__list--item">
                  <Tooltip title="Tin nhắn">
                    <Link to="/home/message">
                      <FaMessage />
                    </Link>
                  </Tooltip>
                </div>
                <div className="header__list--item ">
                  <Tooltip title="Thông báo">
                    <div className="header__badge">
                      <Badge count={countNotification}>
                        <IoMdNotifications onClick={this.toggleNotifications} />
                      </Badge>
                    </div>
                  </Tooltip>
                </div>
                <div className="header__list--item">
                  <Tooltip title={user?.profile?.name}>
                    <Link to="/home/profile">
                      <Avatar size={54} src={img} /> {user?.profile?.name}
                    </Link>
                  </Tooltip>
                  <button className="header__btn" onClick={this.logoutUser}>
                    Đăng xuất
                  </button>
                </div>
              </>
            ) : (
              <div className="header__list--item">
                <Tooltip title="Đăng nhập">
                  <Link to="/login">
                    Đăng nhập <CiLogin />
                  </Link>
                </Tooltip>
              </div>
            )}
         
          {/* Chỉ hiển thị NotificationList khi trạng thái isNotificationVisible là true */}
          {isNotificationVisible && (
            <div ref={(node) => (this.notificationRef = node)}>
              <NotificationList
                onCloseNotifications={(visible) =>
                  this.setState({ isNotificationVisible: visible })
                }
                refreshNotifications={this.countUnreadNotifications}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.userReducer.user,
});

const mapDispatchToProps = {
  countUnreadNotifications,
  getUser,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
