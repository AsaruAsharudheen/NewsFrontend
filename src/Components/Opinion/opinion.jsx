import { useEffect, useState } from 'react';
import axios from 'axios';
import { Spin, Empty } from 'antd';
import Navbar from '../Navbar/navbar';
import { useNavigate } from 'react-router-dom';
import './opinion.css';

const Opinion = () => {
  const [opinionNews, setOpinionNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Use your deployed Render backend
  const API_BASE = 'https://newsbackend-73b7.onrender.com';

  const getOpinionNews = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/News`);
      const opinion = response.data.filter(
        item => item.category?.toLowerCase() === 'opinion'
      );
      setOpinionNews(opinion);
    } catch (err) {
      console.error('Failed to fetch opinion news', err);
    } finally {
      setLoading(false);
    }
  };

  const onCardClick = id => {
    navigate(`/news/${id}`);
  };

  useEffect(() => {
    getOpinionNews();
  }, []);

  return (
    <>
      <Navbar />
      <div className="start-opinion-section">
        <div className="start-opinion-heading-row">
          <h1 className="start-opinion-section-title">OPINION</h1>
          <span className="start-opinion-heading-line"></span>
        </div>

        {loading ? (
          <div className="start-opinion-loader">
            <Spin size="large" />
          </div>
        ) : opinionNews.length === 0 ? (
          <Empty
            description="No opinion news available"
            className="start-opinion-empty-state"
          />
        ) : (
          <div className="start-opinion-news-listing">
            {opinionNews.map(item => (
              <div
                key={item._id}
                className="start-opinion-news-card"
                onClick={() => onCardClick(item._id)}
              >
                <img
                  src={
                    item.images && item.images.length > 0
                      ? item.images[0].startsWith('http')
                        ? item.images[0]
                        : `${API_BASE}/${item.images[0]}`
                      : `${API_BASE}/images/no-image.jpg`
                  }
                  alt={item.title}
                  className="start-opinion-news-image"
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = `${API_BASE}/images/no-image.jpg`;
                  }}
                />
                <div className="start-opinion-news-content">
                  <div className="start-opinion-news-category">Opinion</div>
                  <div className="start-opinion-news-title">{item.title}</div>
                  <div className="start-opinion-news-summary">
                    {item.summary?.length > 120
                      ? item.summary.slice(0, 120) + '...'
                      : item.summary}
                  </div>
                  <div className="start-opinion-news-date">
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

export default Opinion;
