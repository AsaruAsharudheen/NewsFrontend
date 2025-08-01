import { useEffect, useState } from 'react';
import axios from 'axios';
import { Spin, Empty } from 'antd';
import Navbar from '../Navbar/navbar';
import { useNavigate } from 'react-router-dom';
import './women.css';

const Women = () => {
  const [womenNews, setWomenNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_BASE = 'https://newsbackend-73b7.onrender.com'; // ✅ your Render backend base URL

  const getWomenNews = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/News`);
      const women = response.data.filter(
        item => item.category?.toLowerCase() === 'women'
      );
      setWomenNews(women);
    } catch (err) {
      console.error('Failed to fetch women news', err);
    } finally {
      setLoading(false);
    }
  };

  const onCardClick = id => {
    navigate(`/news/${id}`);
  };

  useEffect(() => {
    getWomenNews();
  }, []);

  return (
    <>
      <Navbar />
      <div className="start-women-section">
        <div className="start-women-heading-row">
          <h1 className="start-women-section-title">WOMEN</h1>
          <span className="start-women-heading-line"></span>
        </div>

        {loading ? (
          <div className="start-women-loader">
            <Spin size="large" />
          </div>
        ) : womenNews.length === 0 ? (
          <Empty
            description="No women news available"
            className="start-women-empty-state"
          />
        ) : (
          <div className="start-women-news-listing">
            {womenNews.map(item => (
              <div
                key={item._id}
                className="start-women-news-card"
                onClick={() => onCardClick(item._id)}
              >
                <img
                  src={
                    item.images && item.images.length > 0
                      ? `${API_BASE}${item.images[0]}`
                      : `${API_BASE}/images/no-image.jpg`
                  }
                  alt={item.title}
                  className="start-women-news-image"
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = `${API_BASE}/images/no-image.jpg`;
                  }}
                />
                <div className="start-women-news-content">
                  <div className="start-women-news-category">Women</div>
                  <div className="start-women-news-title">{item.title}</div>
                  <div className="start-women-news-summary">
                    {item.summary?.length > 120
                      ? item.summary.slice(0, 120) + '...'
                      : item.summary}
                  </div>
                  <div className="start-women-news-date">
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

export default Women;
