import { Button, Layout, Menu, message } from "antd";
import {
  UserOutlined,
  FileTextOutlined,
  MessageOutlined,
  HomeOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import { MdLogout } from "react-icons/md";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import Dashboard from "../components/Admin/Dashboard";
import UserManagement from "../components/Admin/UserManagement";
import PostManagement from "../components/Admin/PostManagement";
import CommentManagement from "../components/Admin/CommentManagement";
import MessageManagement from "../components/Admin/MessageManagement";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setError, setMessage } from "../redux/actions/commonAction";
import "../css/Home/AdminPage.scss";
const { Header, Content, Sider } = Layout;

const AdminPage = () => {
  const navigate = useNavigate();
  const msg = useSelector((state) => state.commonReducer.message);
  const err = useSelector((state) => state.commonReducer.error);
  const dispatch = useDispatch();
  const storedUserSession = sessionStorage.getItem("userSession");
  const userSession = storedUserSession ? JSON.parse(storedUserSession) : null;
  const handleLogout = () => {
    let sesion = sessionStorage.removeItem("userSession");
    if (!sesion) {
      navigate("/login");
    }
  };
  useEffect(() => {
    if (!userSession) {
      navigate("/users/login");
      return;
    }
    if (msg) {
      dispatch(setMessage(""));
      message.success(msg);
    }

    if (err) {
      dispatch(setError(""));
      message.success(err);
    }
  }, [msg, err]);
  return (
    <Layout className="admin-layout">
      <Sider collapsible className="admin-sidebar">
        <Menu theme="dark" mode="inline">
          <Menu.Item key="dashboard" icon={<HomeOutlined />}>
            <Link to="/dashboard/">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="users" icon={<UserOutlined />}>
            <Link to="/dashboard/users">Quản lý Người dùng</Link>
          </Menu.Item>
          <Menu.Item key="posts" icon={<FileTextOutlined />}>
            <Link to="/dashboard/posts">Quản lý Bài viết</Link>
          </Menu.Item>
          <Menu.Item key="comments" icon={<CommentOutlined />}>
            <Link to="/dashboard/comments">Quản lý Bình luận</Link>
          </Menu.Item>
          <Menu.Item key="messages" icon={<MessageOutlined />}>
            <Link to="/dashboard/messages">Quản lý Tin nhắn</Link>
          </Menu.Item>
          <Menu.Item key="logout" icon={<MdLogout />}>
            <Button onClick={handleLogout}>Đăng xuất</Button>
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Header className="admin-header">Admin Dashboard</Header>
        <Content className="admin-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/posts" element={<PostManagement />} />
            <Route path="/comments" element={<CommentManagement />} />
            <Route path="/messages" element={<MessageManagement />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminPage;
