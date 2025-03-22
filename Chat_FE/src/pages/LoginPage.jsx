import { Button, Form, Input, message } from "antd";
import React, { Component } from "react";
import withRouter from "../helpers/withRouter";
import { connect } from "react-redux";
import { loginUser } from "../redux/actions/userAction";
import "../css/Home/LoginPage.scss";
import withSocket from "../helpers/withSocket";
import { Link } from "react-router";
class LoginPage extends Component {
  onFinish = async (values) => {
    const login = await this.props.loginUser(values);
    console.log("login", login);
    if (login) {
      this.props.socket
        .emit("register", login.id)
        .emit("user_online", login.id);
      if (login.role === "admin") {
        this.props.router.navigate("/dashboard");
      } else {
        this.props.router.navigate("/");
      }
    }
  };
  onFinishFailed = (errorInfo) => {
    console.log(errorInfo);
  };

  componentDidUpdate(prevProps) {
    if (this.props.message && this.props.message !== prevProps.message) {
      message.success(this.props.message); 
    }

    if (this.props.error && this.props.error !== prevProps.error) {
      message.error(this.props.error);
    }
  }

  componentWillMount() {}

  render() {
    return (
      <div className="login-container">
        <div className="login-form-wrapper">
          <h2 className="login-title">Đăng nhập</h2>
          <Form
            name="login"
            layout="vertical" // Chuyển layout form về dọc
            initialValues={{ remember: true }}
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
            className="login-form"
          >
            <Form.Item
              label="Tên tài khoản"
              name="username"
              rules={[
                { required: true, message: "Vui lòng nhập tên tài khoản!" },
              ]}
            >
              <Input placeholder="Nhập tên tài khoản" />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
          <Link to="/home/register" className="login__action">
            Đăng ký
          </Link>
          <Link to="/home" className="login__action">
            Quay lại
          </Link>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  message: state.commonReducer.message,
  error: state.commonReducer.error
});

const mapDispatchToProps = {
  loginUser,
};

export default withSocket(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(LoginPage))
);
