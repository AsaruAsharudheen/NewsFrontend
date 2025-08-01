import { useEffect, useState } from 'react';
import axios from 'axios';
import { Row, Col, Spin, Empty } from 'antd';
import { useNavigate } from 'react-router-dom';
import './homelatest.css';

const HomeLatest = () => {
  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('https://newsbackend-73b7.onrender.com/api/News/New');
        setLatestNews(response.data);
      } catch (err) {
        console.error('Failed to fetch latest news', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const onCardClick = id => {
    navigate(`/news/${id}`);
  };

  if (loading) {
    return (
      <div className="home-latest-loader">
        <Spin size="large" />
      </div>
    );
  }

  if (latestNews.length === 0) {
    return (
      <Empty
        description="No latest news available"
        className="home-latest-empty"
      />
    );
  }

  const mainNews = latestNews[0];
  const sideTop3 = latestNews.slice(1, 4);
  const bottomCards = latestNews.slice(4, 10);

  return (
    <div className="home-latest-main-container">
      <Row gutter={[24, 24]}>
        {/* Left - Big Card */}
        <Col xs={24} md={16}>
          <div
            className="home-latest-main-card"
            onClick={() => onCardClick(mainNews._id)}
          >
            <img
              className="home-latest-main-image"
              src={
                mainNews.images && mainNews.images.length > 0
                  ? mainNews.images[0].startsWith('http')
                    ? mainNews.images[0]
                    : `https://newsbackend-73b7.onrender.com/${mainNews.images[0]}`
                  : 'https://newsbackend-73b7.onrender.com/images/no-image.jpg'
              }
              alt={mainNews.title}
            />
            <div className="home-latest-main-content">
              <div className="home-latest-main-category">
                {mainNews.category || 'GENERAL'}
              </div>
              <div className="home-latest-main-title">{mainNews.title}</div>
              <div className="home-latest-main-date">
                {new Date(mainNews.createdAt).toLocaleDateString('en-IN')}
              </div>
            </div>
          </div>
        </Col>

        {/* Right - 3 Side-by-side Cards */}
        <Col xs={24} md={8}>
          <div className="home-latest-right-section">
            {sideTop3.map(item => (
              <div
                className="home-latest-right-card"
                key={item._id}
                onClick={() => onCardClick(item._id)}
              >
                <img
                  src={
                    item.images && item.images.length > 0
                      ? item.images[0].startsWith('http')
                        ? item.images[0]
                        : `https://newsbackend-73b7.onrender.com/${item.images[0]}`
                      : 'https://newsbackend-73b7.onrender.com/images/no-image.jpg'
                  }
                  alt={item.title}
                />
                <div className="home-latest-right-info">
                  <div className="home-latest-right-category">
                    {item.category || 'GENERAL'}
                  </div>
                  <div className="home-latest-right-title">
                    {item.title.length > 80
                      ? item.title.slice(0, 80) + '...'
                      : item.title}
                  </div>
                  <div className="home-latest-right-date">
                    {new Date(item.createdAt).toLocaleDateString('en-IN')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Col>
      </Row>

      {/* Bottom 3 Cards */}
      <div className="home-latest-bottom-grid">
        {bottomCards.map(item => (
          <div
            className="home-latest-bottom-card"
            key={item._id}
            onClick={() => onCardClick(item._id)}
          >
            <img
              src={
                item.images && item.images.length > 0
                  ? item.images[0].startsWith('http')
                    ? item.images[0]
                    : `https://newsbackend-73b7.onrender.com/${item.images[0]}`
                  : 'https://newsbackend-73b7.onrender.com/images/no-image.jpg'
              }
              alt={item.title}
            />
            <div className="home-latest-bottom-content">
              <div className="home-latest-bottom-category">
                {item.category || 'GENERAL'}
              </div>
              <h3 className="home-latest-bottom-title">
                {item.title.length > 60
                  ? item.title.slice(0, 60) + '...'
                  : item.title}
              </h3>
              <p
                className="home-latest-bottom-date"
                style={{ color: '#a0a0b3' }}
              >
                {new Date(item.createdAt).toLocaleDateString('en-IN')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeLatest;
