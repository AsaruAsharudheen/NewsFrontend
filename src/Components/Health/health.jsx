import { useEffect, useState } from 'react';
import axios from 'axios';
import { Spin, Empty } from 'antd';
import Navbar from '../Navbar/navbar';
import { useNavigate } from 'react-router-dom';
import './health.css';

const BASE_URL = 'https://newsbackend-73b7.onrender.com';

const Health = () => {
  const [healthNews, setHealthNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    handleResize(); // set on mount

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getHealthNews = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/News`);
      const health = response.data.filter(
        item => item.category?.toLowerCase() === 'health'
      );
      setHealthNews(health);
    } catch (err) {
      console.error('Failed to fetch health news', err);
    } finally {
      setLoading(false);
    }
  };

  const onCardClick = id => {
    navigate(`/news/${id}`);
  };

  useEffect(() => {
    getHealthNews();
  }, []);

  return (
    <>
      <Navbar />
      <div className="health-section">
        <div className="health-heading-row">
          <h1
            className="health-section-title"
            style={{ display: isMobile ? 'none' : 'block' }}
          >
            HEALTH
          </h1>
          <span className="heading-line"></span>
        </div>

        {loading ? (
          <div className="health-loader">
            <Spin size="large" />
          </div>
        ) : healthNews.length === 0 ? (
          <Empty
            description="No health news available"
            className="health-empty-state"
          />
        ) : (
          <div className="health-news-listing">
            {healthNews.map(item => (
              <div
                key={item._id}
                className="health-news-card"
                onClick={() => onCardClick(item._id)}
              >
                <img
                  src={
                    item.images && item.images.length > 0
                      ? item.images[0].startsWith('http')
                        ? item.images[0]
                        : `${BASE_URL}/${item.images[0]}`
                      : `${BASE_URL}/images/no-image.jpg`
                  }
                  alt={item.title}
                  className="health-news-image"
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = `${BASE_URL}/images/no-image.jpg`;
                  }}
                />
                <div className="health-news-content">
                  <div className="health-news-category">Health</div>
                  <div className="health-news-title">{item.title}</div>
                  <div className="health-news-summary">
                    {item.summary?.length > 120
                      ? item.summary.slice(0, 120) + '...'
                      : item.summary}
                  </div>
                  <div className="health-news-date">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'No date'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Health;
