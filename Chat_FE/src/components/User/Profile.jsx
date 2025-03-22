import React, { Component } from "react";
import { Card, Button, Typography, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import "../../css/User/Profile.scss";
import { connect } from "react-redux";
import { getUser, updateUser } from "../../redux/actions/userAction";
import withRouter from "../../helpers/withRouter.js";
import ProfileEdit from "./ProfileEdit.jsx";
import FriendList from "./FriendList.jsx";
const { Title, Text } = Typography;

class Profile extends Component {
  // Giả sử đây là dữ liệu thông tin người dùng bạn lấy từ API hoặc redux

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      user: {},
    };
  }

  componentDidMount() {
    const userSession = sessionStorage.getItem("userSession")
      ? JSON.parse(sessionStorage.getItem("userSession"))
      : null;
    if (userSession) {
      this.props.getUser(userSession.id);
    } else {
      this.props.router.navigate("/");
    }
  }
  onEdit = (value) => {
    console.log(value);
    const userSession = sessionStorage.getItem("userSession")
      ? JSON.parse(sessionStorage.getItem("userSession"))
      : null;
    this.props.updateUser(userSession.id, value);
    this.setState({ ...this.state, open: false });
  };
  render() {
    const userSession = sessionStorage.getItem("userSession")
      ? JSON.parse(sessionStorage.getItem("userSession"))
      : null;
    const { user } = this.props;
    const { open } = this.state;
    const img = user.profile?.avatar ? user.profile?.avatar : null;
    return (
      <>
        <div className="profile__container">
          <div className="profile__content">
            <Card
              hoverable
              style={{ width: 400, margin: "0 auto", padding: "20px" }}
              cover={
                <Avatar
                  size={100}
                  src={img}
                  icon={<UserOutlined />}
                  style={{ margin: "0 auto", display: "block" }}
                />
              }
            >
              <Title level={2} style={{ textAlign: "center" }}>
                {user.profile?.name}
              </Title>
              <Text strong>Tên đăng nhập:</Text>
              <Text>{user.username}</Text>
              <br />
              <Text strong>Email:</Text>
              <Text>{user.email}</Text>
              <br />

              <Text strong>Mô tả:</Text>
              <Text>{user.profile?.bio}</Text>
              <br />
              <Text strong>Địa chỉ:</Text>
              <Text>{user.profile?.location}</Text>
              <br />
              <div style={{ marginTop: 20, textAlign: "center" }}>
                <Button
                  type="primary"
                  onClick={() => {
                    this.setState({ ...this.state, open: true });
                  }}
                >
                  Chỉnh sửa thông tin
                </Button>
              </div>
            </Card>
          </div>
          <div className="profile__friendly">
            <FriendList id={userSession.id} />
          </div>
        </div>
        {open && (
          <ProfileEdit
            open={open}
            onCancel={() => {
              this.setState({ ...this.state, open: false });
            }}
            onEdit={this.onEdit}
            user={user}
          />
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.userReducer.user,
});

const mapDispatchToProps = {
  getUser,
  updateUser,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Profile)
);
