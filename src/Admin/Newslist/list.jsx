import axios from 'axios';
import './list.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../Components/AdminLayout/layout';
import {
  Card,
  Col,
  Row,
  Typography,
  Spin,
  Empty,
  Popconfirm,
  message,
} from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const { Title } = Typography;

const List = () => {
  const [listNews, setListNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getListNews = async () => {
    try {
      const response = await axios.get('http://localhost:8889/api/News');
      setListNews(response.data);
    } catch (err) {
      console.error('Error fetching news list:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteById = async id => {
    try {
      await axios.delete(`http://localhost:8889/api/News/${id}`);
      message.success('News item deleted successfully');
      getListNews();
    } catch (err) {
      console.error('Error deleting news:', err);
      message.error('Failed to delete news item');
    }
  };

  useEffect(() => {
    getListNews();
  }, []);

  return (
    <AdminLayout>
      <div className="list-container">
        <Title level={3} className="list-title">
          News List
        </Title>

        {loading ? (
          <div className="list-spin-wrapper">
            <Spin size="large" />
          </div>
        ) : listNews.length === 0 ? (
          <Empty description="No news found" />
        ) : (
          <Row gutter={[16, 16]}>
            {listNews.map(item => (
              <Col xs={24} sm={12} md={8} lg={6} key={item._id}>
                <Card
                  hoverable
                  cover={
                    <img
                      src={
                        item.images && item.images.length > 0
                          ? (item.images[0].startsWith('http')
                              ? item.images[0]
                              : `http://localhost:8889/${item.images[0]}`
                            )
                          : 'http://localhost:8889/images/no-image.jpg'
                      }
                      alt={item.title}
                      className="news-image-item"
                    />
                  }
                  actions={[
                    <Popconfirm
                      title="Are you sure to delete this news?"
                      onConfirm={() => deleteById(item._id)}
                      okText="Yes"
                      cancelText="No"
                      key="confirm"
                    >
                      <DeleteOutlined style={{ color: 'red' }} />
                    </Popconfirm>,
                    <EditOutlined
                      style={{ color: 'red' }}
                      onClick={() => navigate(`/update/${item._id}`)}
                      key="edit"
                    />,
                  ]}
                >
                  <Card.Meta
                    title={item.title}
                    description={
                      <span className="news-description">
                        {item.summary?.slice(0, 80) || 'No summary available'}
                      </span>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </AdminLayout>
  );
};

export default List;
