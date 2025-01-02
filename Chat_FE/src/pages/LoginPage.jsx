import { Button, Form, Input } from "antd";
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

    if (login) {
      this.props.socket
        .emit("register", login.id)
        .emit("user_online", login.id);
      this.props.router.navigate("/");
    }
  };
  onFinishFailed = (errorInfo) => {
    console.log(errorInfo);
  };

  componentWillMount() {}

  render() {
    return (
      <div className="login-container">
        <div className="login-form-wrapper">
          <h2 className="login-title">Đăng nhập</h2>
          <Form
            name="login"
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
          <Link to="/register">Đăng ký</Link>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
  loginUser,
};

export default withSocket(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(LoginPage))
);
