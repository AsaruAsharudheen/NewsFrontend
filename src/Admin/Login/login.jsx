import './login.css';
import { Input, Button, Typography, Card, Form } from 'antd';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Make sure you have react-toastify installed

const { Title } = Typography;

const AdminLogin = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState({ email: '', password: '' });

  const onChange = (e, key) => {
    setLogin({ ...login, [key]: e.target.value });
  };

  const onLogin = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8889/api/admin/login',
        login
      );
      localStorage.setItem('ID', response.data.id);
      localStorage.setItem('TOKEN', response.data.token);
      localStorage.setItem('ROLE', response.data.role);
      toast.success('Logged in successfully');
      navigate('/admin/list');
    } catch (e) {
      if (e.response && e.response.status === 400) {
        toast.error('Email or password incorrect');
      } else {
        toast.error(e.message || 'Login failed');
      }
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card" bordered={false}>
        <Title level={3} style={{ textAlign: 'center' }}>
          Admin Login
        </Title>
        <Form layout="vertical">
          <Form.Item label="Email">
            <Input
              placeholder="Enter your email"
              value={login.email}
              onChange={(e) => onChange(e, 'email')}
            />
          </Form.Item>
          <Form.Item label="Password">
            <Input.Password
              placeholder="Enter your password"
              value={login.password}
              onChange={(e) => onChange(e, 'password')}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" block onClick={onLogin}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AdminLogin;
