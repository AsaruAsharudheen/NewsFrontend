import { Button, Input, Typography, Space, Divider } from 'antd';
import {
  WhatsAppOutlined,
  YoutubeOutlined,
  FacebookOutlined,
  InstagramOutlined,
} from '@ant-design/icons';
import './about.css';

const { Title, Text } = Typography;

const About = () => {
  return (
    <div className="about-container">
      <div className="newsletter-box">
        <Title level={3}>Subscribe to Our Newsletter</Title>
        <Text type="secondary">Enter your email below to get the latest news updates</Text>
        <Space.Compact style={{ marginTop: '15px' }}>
          <Input placeholder="Enter your email" style={{ width: 250 }} />
          <Button type="primary">Subscribe</Button>
        </Space.Compact>
      </div>

      <Divider />

      <div className="links-box">
        <Space size="large">
          <Button type="link">Home</Button>
          <Button type="link">About</Button>
          <Button type="link">Contact</Button>
          <Button type="link">All News</Button>
        </Space>
      </div>

      <Divider />

      <div className="social-icons">
        <Title level={5}>Follow us on</Title>
        <Space size="large">
          <a href="https://wa.me/yourNumber" target="_blank" rel="noopener noreferrer">
            <WhatsAppOutlined style={{ fontSize: '24px', color: '#25D366' }} />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
            <YoutubeOutlined style={{ fontSize: '24px', color: '#FF0000' }} />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FacebookOutlined style={{ fontSize: '24px', color: '#1877F2' }} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <InstagramOutlined style={{ fontSize: '24px', color: '#E1306C' }} />
          </a>
        </Space>
      </div>
    </div>
  );
};

export default About;
