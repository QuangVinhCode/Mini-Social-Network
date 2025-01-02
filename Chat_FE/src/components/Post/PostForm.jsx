import { Button, Form, Input, Modal, Upload } from "antd";
import React, { Component, createRef } from "react";
import { UploadOutlined } from "@ant-design/icons";
import PostService from "../../services/postService";
class PostForm extends Component {
  form = createRef();

  state = {
    fileList: [], // Danh sách file hình ảnh
  };

  componentDidMount() {
    const { post } = this.props;
    if (post && post.images) {
      // Chuyển đổi `images` từ post thành `fileList`
      const fileList = post.images.map((img, index) => ({
        uid: `-${index}`, // Tạo UID duy nhất
        name: img,
        status: "done",
        url: PostService.getImage(img), // Lấy URL từ dịch vụ
      }));
      this.setState({ fileList });
    }
  }

  handlePreview = (file) => {
    window.open(file.url || file.thumbUrl, "_blank");
  };

  handleChange = ({ fileList }) => {
    this.setState({ fileList });
  };

  render() {
    const { open, onCancel, onExecute, post } = this.props;
    const { fileList } = this.state;
    const userSession = sessionStorage.getItem("userSession")
      ? JSON.parse(sessionStorage.getItem("userSession"))
      : null;
    return (
      <Modal
        open={open}
        title={post._id ? "Cập nhật bài viết" : "Đăng bài viết"}
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
              onExecute(values);
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
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
              beforeUpload={() => false} // Ngăn tải lên ngay lập tức
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
