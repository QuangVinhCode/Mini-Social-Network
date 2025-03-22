import React, { Component } from "react";
import { Avatar, Badge, Input, Tooltip } from "antd"; // Import Tooltip
import { connect } from "react-redux";
import withRouter from "../../helpers/withRouter.js";
import "../../css/Home/Header.scss";
import logo from "../../logo.png";
import { FaBars, FaMessage } from "react-icons/fa6";
import { IoIosAddCircle, IoMdNotifications } from "react-icons/io";
import { Link } from "react-router";
import NotificationList from "../Notification/NotificationList.js";
import { countUnreadNotifications } from "../../redux/actions/notificationAction.jsx";
import { getUser } from "../../redux/actions/userAction.jsx";
import { FaTimes } from "react-icons/fa";
import UserService from "../../services/userService.jsx";
const { Search } = Input;
class Header extends Component {
  state = {
    isNotificationVisible: false,
    menu: false,
    countNotification: 0,
  };
  userService = new UserService();

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
      this.userService.logoutUser(userSession.id);
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
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  render() {
    const userSession = sessionStorage.getItem("userSession")
      ? JSON.parse(sessionStorage.getItem("userSession"))
      : null;
    const { user } = this.props;
    const img = user.profile?.avatar ? user.profile?.avatar : null;
    const { menu, countNotification, isNotificationVisible } = this.state;
    return (
      <div className="header__container">
        <div className="header__logo">
          <div className="header__logo--item">
            <Link to="/">
              <Avatar className="avatar-custom" size={60} src={logo} />
            </Link>
            <div
              className="hamburger"
              onClick={() => this.setState({ menu: !menu })}
            >
              {menu ? <FaTimes /> : <FaBars />}
            </div>
          </div>
          <div className="header__logo--item header__search">
            <Search
              className="header__logo--search"
              placeholder="Tìm kiếm..."
            />
          </div>
        </div>
        <div className={`header__item ${menu ? "active" : ""}`}>
          {userSession ? (
            <>
              <div className="header__list--item">
                <Tooltip
                  title="Đăng bài viết"
                  onClick={() => this.props.onOpen()}
                >
                  <div className="header__badge">
                    <IoIosAddCircle />
                    <span className="header__text">Đăng bài viết</span>
                  </div>
                </Tooltip>
              </div>
              <div className="header__list--item">
                <Tooltip title="Tin nhắn">
                  <Link to="/home/message">
                    <div className="header__badge">
                      <FaMessage />
                      <span className="header__text">Tin nhắn</span>
                    </div>
                  </Link>
                </Tooltip>
              </div>
              <div className="header__list--item ">
                <Tooltip title="Thông báo">
                  <div className="header__badge">
                    <Badge count={countNotification}>
                      <IoMdNotifications onClick={this.toggleNotifications} />
                    </Badge>
                    <span className="header__text">Thông báo</span>
                  </div>
                </Tooltip>
              </div>
              <div className="header__list--item">
                <Tooltip title={user?.profile?.name}>
                  <Link to="/home/profile">
                    <Avatar size={54} src={img} /> {user?.profile?.name}
                  </Link>
                </Tooltip>
                <div className="header__btn_container">
                  <button className="header__btn" onClick={this.logoutUser}>
                    Đăng xuất
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="header__list--item">
              <Tooltip title="Đăng nhập">
                <Link
                  to="/login"
                  className="px-6 py-2 mb-1 bg-gradient-to-r from-blue-500 to-purple-500 
             text-white font-semibold rounded-full shadow-md 
             hover:from-blue-600 hover:to-purple-600 transition-all 
             duration-300 ease-in-out transform hover:scale-105"
                >
                  Đăng nhập
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
