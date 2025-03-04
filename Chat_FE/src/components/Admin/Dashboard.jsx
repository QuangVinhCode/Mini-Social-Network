import { Card, Statistic, Row, Col } from "antd";
import { UserOutlined, FileTextOutlined, MessageOutlined } from "@ant-design/icons";
import "../../css/Admin/Dashboard.scss";

const Dashboard = () => {
  return (
    <Row gutter={16} className="dashboard">
      <Col span={8}>
        <Card className="dashboard-card">
          <Statistic title="Tổng số người dùng" value={100} prefix={<UserOutlined />} />
        </Card>
      </Col>
      <Col span={8}>
        <Card className="dashboard-card">
          <Statistic title="Tổng số bài viết" value={250} prefix={<FileTextOutlined />} />
        </Card>
      </Col>
      <Col span={8}>
        <Card className="dashboard-card">
          <Statistic title="Tổng số tin nhắn" value={500} prefix={<MessageOutlined />} />
        </Card>
      </Col>
    </Row>
  );
};

export default Dashboard;
