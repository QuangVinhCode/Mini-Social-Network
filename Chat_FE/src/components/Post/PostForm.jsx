import { Button, Form, Input, Modal, Upload } from "antd";
import React, { Component, createRef } from "react";
import { UploadOutlined } from "@ant-design/icons";

class PostForm extends Component {
  form = createRef();

  state = {
    fileList: [],
  };

  componentDidMount() {
    this.loadInitialData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.post !== this.props.post) {
      this.loadInitialData();
    }
  }

  loadInitialData = () => {
    const { post } = this.props;
    if (post && post.images) {
      const fileList = post.images.map((img, index) => ({
        uid: `-${index}`,
        name: img,
        status: "done",
        url: img,
      }));
      this.setState({ fileList });
    } else {
      this.setState({ fileList: [] });
    }
  };

  handlePreview = (file) => {
    window.open(file.url || file.thumbUrl, "_blank");
  };

  handleChange = ({ fileList }) => {
    this.setState({ fileList });
  };

  handleCancel = () => {
    if (this.form.current) {
      this.form.current.resetFields();
    }
    this.setState({ fileList: [] }); // Xóa trắng danh sách tệp
    this.props.onCancel();
  };

  handleOk = () => {
    this.form.current
      .validateFields()
      .then((values) => {
        this.form.current.resetFields();
        this.setState({ fileList: [] }); // Xóa trắng danh sách tệp

        console.log("-------object in values form--------");
        console.log(values);
        this.props.onExecute(values);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  render() {
    const { open, post } = this.props;
    const { fileList } = this.state;

    return (
      <Modal
        open={open}
        title={post._id ? "Cập nhật bài viết" : "Đăng bài viết"}
        okText="Xác nhận"
        cancelText="Hủy"
        onCancel={this.handleCancel}
        onOk={this.handleOk}
      >
        <Form ref={this.form} layout="vertical">
          <Form.Item
            label="Nội dung"
            name="content"
            initialValue={post?.content}
            rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
          >
            <Input.TextArea rows={4} placeholder="Nhập nội dung bài viết" />
          </Form.Item>

          <Form.Item label="Hình ảnh" name="images">
            <Upload
              listType="picture"
              fileList={fileList}
              onPreview={this.handlePreview}
              onChange={this.handleChange}
              accept="image/*"
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default PostForm;
