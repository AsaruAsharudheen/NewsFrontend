import './login.css';
import { Input, Button, Typography, Card, Form } from 'antd';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const { Title } = Typography;

const BASE_URL = 'https://newsbackend-73b7.onrender.com'; // Use your hosted URL

const AdminLogin = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const onChange = (e, key) => {
    setLogin(prev => ({ ...prev, [key]: e.target.value }));
  };

  const onLogin = async () => {
    if (!login.email.trim() || !login.password.trim()) {
      toast.warning('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${BASE_URL}/api/admin/login`, login);
      localStorage.setItem('ID', response.data.id);
      localStorage.setItem('TOKEN', response.data.token);
      localStorage.setItem('ROLE', response.data.role);
      toast.success('Logged in successfully!');
      navigate('/admin/list');
    } catch (err) {
      console.error('Login failed:', err);
      if (err.response?.status === 400) {
        toast.error('Email or password incorrect.');
      } else {
        toast.error(err.message || 'Login failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card" bordered={false}>
        <Title level={3} style={{ textAlign: 'center' }}>
          Admin Login
        </Title>
        <Form layout="vertical" onFinish={onLogin}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please enter your email.' }]}
          >
            <Input
              placeholder="Enter your email"
              value={login.email}
              onChange={e => onChange(e, 'email')}
            />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter your password.' }]}
          >
            <Input.Password
              placeholder="Enter your password"
              value={login.password}
              onChange={e => onChange(e, 'password')}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AdminLogin;
