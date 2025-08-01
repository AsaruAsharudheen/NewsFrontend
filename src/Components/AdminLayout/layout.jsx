import { Button, Layout, Menu, Drawer } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HomeOutlined,
  PlusCircleOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import './layout.css';

const { Content } = Layout;

const AdminLayout = ({ children, heading = 'Dashboard' }) => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  const onLogout = () => {
    localStorage.removeItem('ID');
    localStorage.removeItem('TOKEN');
    localStorage.removeItem('ROLE');
    navigate('/admin/Login');
  };

  const toggleDrawer = () => {
    setVisible(!visible);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Drawer
        title="Admin Panel"
        placement="left"
        closable={true}
        onClose={toggleDrawer}
        open={visible}
        width={220}
        bodyStyle={{ padding: 0 }}
      >
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          style={{ height: '100%' }}
        >
          <Menu.Item key="1" icon={<HomeOutlined />} onClick={() => { navigate('/admin/list'); toggleDrawer(); }}>
            Home
          </Menu.Item>
          <Menu.Item key="2" icon={<PlusCircleOutlined />} onClick={() => { navigate('/admin/add'); toggleDrawer(); }}>
            Add News
          </Menu.Item>
          <Menu.Item key="3" icon={<UserOutlined />}>
            Profile
          </Menu.Item>
          <Menu.Item key="4" icon={<SettingOutlined />}>
            Settings
          </Menu.Item>
          <Menu.Item key="5" icon={<LogoutOutlined />} onClick={onLogout}>
            Logout
          </Menu.Item>
        </Menu>
      </Drawer>

      <Layout className="site-layout">
        <Content className="content-area">
          <div className="header-bar">
            <Button
              icon={<MenuOutlined />}
              type="primary"
              onClick={toggleDrawer}
              style={{ marginBottom: '16px' }}
            >
              Menu
            </Button>
            <h2 className="heading" style={{ display: 'inline-block', marginLeft: '20px' }}>
              {heading}
            </h2>
          </div>
          <div className="main-content">{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
