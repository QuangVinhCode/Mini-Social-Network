import { Button, Divider, Form, Image, Input, Modal, Upload } from "antd";
import React, { Component, createRef } from "react";
import { UploadOutlined } from "@ant-design/icons";
import PostService from "../../services/postService";
class ProfileEdit extends Component {
  form = createRef();

  constructor(props) {
    super(props);

    this.state = {
      previewImage: "",
      previewVisible: false,
    };
  }
  handlePreview = (file) => {
    if (file.thumbUrl) {
      this.setState({
        ...this.state,
        previewImage: file.thumbUrl,
        previewVisible: true,
      });
    }
  };

  handleRemove = (value) => {
    return false;
  };

  normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    if (e.fileList.length > 1) {
      return [e.fileList[1]];
    }
    const originalFileObj = e.fileList[0].originFileObj;
    console.log("Original File Object:", originalFileObj);
    return e && e.fileList;
  };

  render() {
    const { open, onCancel, user, onEdit } = this.props;
    const url = user ? user.profile.avatar : "";
    const initialImage = {
      url: url,
      uid: user.profile.avatar,
    };
    return (
      <Modal
        open={open}
        title="Cập nhật người dùng"
        okText="Xác nhận"
        cancelText="Hủy"
        onCancel={() => {
          this.form.current.resetFields();
          onCancel();
        }}
        onOk={() => {
          this.form.current
            .validateFields()
            .then((values) => {
              this.form.current.resetFields();

              console.log("-------object in values form--------");
              console.log(values);
              onEdit(values);
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
      >
        <Form ref={this.form} layout="vertical" key={"f" + user._id}>
          <Form.Item
            label="Tên tài khoản"
            name="username"
            initialValue={user.username}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            initialValue={user ? user.email : ""}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="Tên"
            name={["profile", "name"]}
            initialValue={user ? user.profile.name : ""}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Bio"
            name={["profile", "bio"]}
            initialValue={user ? user.profile.bio : ""}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            label="Địa chỉ"
            name={["profile", "location"]}
            initialValue={user ? user.profile.location : ""}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Avatar"
            name={["profile", "avatar"]}
            initialValue={user ? [initialImage] : []}
            valuePropName="fileList"
            rules={[{ required: true, message: "Yêu cầu chọn file png" }]}
            getValueFromEvent={this.normFile}
          >
            <Upload
              listType="picture"
              onPreview={this.handlePreview}
              onRemove={this.handleRemove}
              accept="image/*"
              maxCount={1}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
            </Upload>
          </Form.Item>
          <Divider></Divider>
          {this.state.previewVisible && (
            <Image
              src={this.state.previewImage}
              style={{ with: 200 }}
              preview={{ visible: false }}
            ></Image>
          )}
        </Form>
      </Modal>
    );
  }
}

export default ProfileEdit;
