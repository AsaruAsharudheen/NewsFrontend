import { useEffect, useState } from 'react';
import axios from 'axios';
import { Spin, Empty } from 'antd';
import Navbar from '../Navbar/navbar';
import { useNavigate } from 'react-router-dom';
import './culture.css';

const Culture = () => {
  const [cultureNews, setCultureNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getCultureNews = async () => {
    try {
      const response = await axios.get('http://localhost:8889/api/News');
      const culture = response.data.filter(
        item => item.category?.toLowerCase() === 'culture'
      );
      setCultureNews(culture);
    } catch (err) {
      console.error('Failed to fetch culture news', err);
    } finally {
      setLoading(false);
    }
  };

  const onCardClick = id => {
    navigate(`/news/${id}`);
  };

  useEffect(() => {
    getCultureNews();
  }, []);

  return (
    <>
      <Navbar />
      <div className="start-culture-section">
        <div className="start-culture-heading-row">
          <h1 className="start-culture-section-title">CULTURE</h1>
          <span className="start-culture-heading-line"></span>
        </div>

        {loading ? (
          <div className="start-culture-loader">
            <Spin size="large" />
          </div>
        ) : cultureNews.length === 0 ? (
          <Empty
            description="No culture news available"
            className="start-culture-empty-state"
          />
        ) : (
          <div className="start-culture-news-listing">
            {cultureNews.map(item => (
              <div
                key={item._id}
                className="start-culture-news-card"
                onClick={() => onCardClick(item._id)}
              >
                <img
                  src={
                    item.images && item.images.length > 0
                      ? item.images[0]
                      : 'http://localhost:8889/images/no-image.jpg'
                  }
                  alt={item.title}
                  className="start-culture-news-image"
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = 'http://localhost:8889/images/no-image.jpg';
                  }}
                />
                <div className="start-culture-news-content">
                  <div className="start-culture-news-category">Culture</div>
                  <div className="start-culture-news-title">{item.title}</div>
                  <div className="start-culture-news-summary">
                    {item.summary?.length > 120
                      ? item.summary.slice(0, 120) + '...'
                      : item.summary}
                  </div>
                  <div className="start-culture-news-date">
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

export default Culture;
