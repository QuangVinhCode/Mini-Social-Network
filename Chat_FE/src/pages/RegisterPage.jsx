import React, { Component } from "react";
import { Form, Input, Button, message } from "antd";
import "../css/Home/RegisterPage.scss";
import { connect } from "react-redux";
import { registerUser } from "../redux/actions/userAction";
import { Link, Navigate } from "react-router";
import withRouter from "../helpers/withRouter";

class RegisterPage extends Component {
  state = {
    loading: false,
  };

  onFinish = (values) => {
    this.setState({ loading: true });
    this.props.registerUser(values, this.props.router.navigate);
    this.setState({ loading: false });
  };

  render() {
    return (
      <div className="register-page-wrapper">
        <div className="register-container">
          <h2>Đăng ký</h2>
          <Form
            layout="vertical"
            onFinish={this.onFinish}
            autoComplete="off"
            initialValues={{ profile: {} }}
          >
            <Form.Item
              label="Tên đăng nhập"
              name="username"
              rules={[
                { required: true, message: "Vui lòng nhập tên đăng nhập" },
              ]}
            >
              <Input placeholder="Tên đăng nhập" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Vui lòng nhập email" }]}
            >
              <Input placeholder="Email" type="email" />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
            >
              <Input.Password placeholder="Mật khẩu" />
            </Form.Item>
            <Form.Item
              name="confirm"
              label="Nhập lại mật khẩu"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Nhập lại mật khẩu!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Mật khẩu không khớp!"));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Nhập lại mật khẩu" />
            </Form.Item>
            <Form.Item
              label="Họ và tên"
              name={["profile", "name"]}
              rules={[{ required: true, message: "Vui lòng nhập tên" }]}
            >
              <Input placeholder="Họ và tên đầy đủ" />
            </Form.Item>

            <Form.Item label="Mô tả" name={["profile", "bio"]}>
              <Input.TextArea placeholder="Mô tả ngắn gọn về bạn" />
            </Form.Item>

            <Form.Item label="Vị trí" name={["profile", "location"]}>
              <Input placeholder="Địa điểm của bạn" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={this.state.loading}
                block
              >
                Đăng ký
              </Button>
            </Form.Item>
          </Form>
          <Link to="/login">Đăng nhập</Link>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
  registerUser,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(RegisterPage)
);
