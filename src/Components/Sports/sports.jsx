import './sports.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Spin, Empty } from 'antd';
import Navbar from '../Navbar/navbar';
import { format } from 'date-fns';

const Sports = () => {
  const [sportsNews, setSportsNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getSportsNews = async () => {
    try {
      const response = await axios.get('http://localhost:8889/api/News');
      const sports = response.data.filter(
        item => item.category?.toLowerCase() === 'sports'
      );
      setSportsNews(sports);
    } catch (err) {
      console.error('Failed to fetch sports news', err);
    } finally {
      setLoading(false);
    }
  };

  const onCardClick = id => {
    navigate(`/news/${id}`);
  };

  useEffect(() => {
    getSportsNews();
  }, []);

  return (
    <>
      <Navbar />
      <div className="sports-section">
        <div className="business-heading-row">
          <h1 className="business-section-title">SPORTS</h1>
          <span className="heading-line"></span>
        </div>

        {loading ? (
          <div className="sports-loader">
            <Spin size="large" />
          </div>
        ) : sportsNews.length === 0 ? (
          <div className="sports-empty-state">
            <Empty description="No sports news available" />
          </div>
        ) : (
          <div className="sports-news-listing">
            {sportsNews.map(item => (
              <div
                key={item._id}
                className="sports-news-card"
                onClick={() => onCardClick(item._id)}
              >
                <img
                  alt={item.title}
                  src={
                    (item.images && item.images.length > 0
                      ? item.images[0]
                      : 'http://localhost:8889/images/no-image.jpg')
                  }
                  className="sports-news-image"
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = 'http://localhost:8889/images/no-image.jpg';
                  }}
                />
                <div className="sports-news-content">
                  <div className="sports-news-category">Sports</div>
                  <div className="sports-news-title">{item.title}</div>

                  <div className="sports-news-date">
                    {item.createdAt
                      ? format(new Date(item.createdAt), 'dd MMM yyyy')
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

export default Sports;
