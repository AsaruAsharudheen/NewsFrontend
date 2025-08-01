import { useEffect, useState } from 'react';
import axios from 'axios';
import { Spin, Empty } from 'antd';
import Navbar from '../Navbar/navbar';
import { useNavigate } from 'react-router-dom';
import './pravasi.css';

const Pravasi = () => {
  const [pravasiNews, setPravasiNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Replace localhost with Render backend
  const API_BASE = 'https://newsbackend-73b7.onrender.com';

  const getPravasiNews = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/News`);
      const pravasi = response.data.filter(
        item => item.category?.toLowerCase() === 'pravasi'
      );
      setPravasiNews(pravasi);
    } catch (err) {
      console.error('Failed to fetch pravasi news', err);
    } finally {
      setLoading(false);
    }
  };

  const onCardClick = id => {
    navigate(`/news/${id}`);
  };

  useEffect(() => {
    getPravasiNews();
  }, []);

  return (
    <>
      <Navbar />
      <div className="start-pravasi-section">
        <div className="start-pravasi-heading-row">
          <h1 className="start-pravasi-section-title">PRAVASI</h1>
          <span className="start-pravasi-heading-line"></span>
        </div>

        {loading ? (
          <div className="start-pravasi-loader">
            <Spin size="large" />
          </div>
        ) : pravasiNews.length === 0 ? (
          <Empty
            description="No pravasi news available"
            className="start-pravasi-empty-state"
          />
        ) : (
          <div className="start-pravasi-news-listing">
            {pravasiNews.map(item => (
              <div
                key={item._id}
                className="start-pravasi-news-card"
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
                  className="start-pravasi-news-image"
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = `${API_BASE}/images/no-image.jpg`;
                  }}
                />
                <div className="start-pravasi-news-content">
                  <div className="start-pravasi-news-category">Pravasi</div>
                  <div className="start-pravasi-news-title">{item.title}</div>
                  <div className="start-pravasi-news-summary">
                    {item.summary?.length > 120
                      ? item.summary.slice(0, 120) + '...'
                      : item.summary}
                  </div>
                  <div className="start-pravasi-news-date">
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

export default Pravasi;
