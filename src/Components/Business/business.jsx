import { useEffect, useState } from 'react';
import axios from 'axios';
import { Spin, Empty } from 'antd';
import Navbar from '../Navbar/navbar';
import { useNavigate } from 'react-router-dom';
import './business.css';

const Business = () => {
  const [businessNews, setBusinessNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getBusinessNews = async () => {
    try {
      const response = await axios.get('http://localhost:8889/api/News');
      const business = response.data.filter(
        item => item.category?.toLowerCase() === 'business'
      );
      setBusinessNews(business);
    } catch (err) {
      console.error('Failed to fetch business news', err);
    } finally {
      setLoading(false);
    }
  };

  const onCardClick = id => {
    navigate(`/news/${id}`);
  };

  useEffect(() => {
    getBusinessNews();
  }, []);

  return (
    <>
      <Navbar />
      <div className="business-section">
        <div className="business-heading-row">
          <h1 className="business-section-title">Business</h1>
          <span className="heading-line"></span>
        </div>

        {loading ? (
          <div className="business-loader">
            <Spin size="large" />
          </div>
        ) : businessNews.length === 0 ? (
          <Empty
            description="No business news available"
            className="business-empty-state"
          />
        ) : (
          <div className="business-news-listing">
            {businessNews.map(item => (
              <div
                key={item._id}
                className="business-news-card"
                onClick={() => onCardClick(item._id)}
              >
                <img
                  src={
                    item.images && item.images.length > 0
                      ? item.images[0]
                      : 'http://localhost:8889/images/no-image.jpg'
                  }
                  alt={item.title}
                  className="business-news-image"
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = 'http://localhost:8889/images/no-image.jpg';
                  }}
                />
                <div className="business-news-content">
                  <div className="business-news-category">Business</div>
                  <div className="business-news-title">{item.title}</div>
                  <div className="business-news-summary">
                    {item.summary?.length > 120
                      ? item.summary.slice(0, 120) + '...'
                      : item.summary}
                  </div>
                  <div className="business-news-date">
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

export default Business;
