import { useEffect, useState } from 'react';
import axios from 'axios';
import { Spin, Empty, Typography } from 'antd';
import Navbar from '../Navbar/navbar';
import { useNavigate } from 'react-router-dom';
import './politics.css';

const { Title, Paragraph } = Typography;

const Politics = () => {
  const [politicsNews, setPoliticsNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getPoliticsNews = async () => {
    try {
      const response = await axios.get('http://localhost:8889/api/News');
      const politics = response.data.filter(
        item => item.category?.toLowerCase() === 'politics'
      );
      setPoliticsNews(politics);
    } catch (err) {
      console.error('Failed to fetch politics news', err);
    } finally {
      setLoading(false);
    }
  };

  const onCardClick = id => {
    navigate(`/news/${id}`);
  };

  useEffect(() => {
    getPoliticsNews();
  }, []);

  return (
    <>
      <Navbar />
      <div className="politics-section">
        <div className="business-heading-row">
          <h1 className="business-section-title">POLITICS</h1>
          <span className="heading-line"></span>
        </div>

        {loading ? (
          <div className="politics-loader">
            <Spin size="large" />
          </div>
        ) : politicsNews.length === 0 ? (
          <Empty
            description="No politics news available"
            className="politics-empty-state"
          />
        ) : (
          <div className="politics-news-listing">
            {politicsNews.map(item => (
              <div
                key={item._id}
                className="politics-news-card"
                onClick={() => onCardClick(item._id)}
              >
                <img
                  src={
                    (item.images && item.images.length > 0
                      ? item.images[0]
                      : 'http://localhost:8889/images/no-image.jpg')
                  }
                  alt={item.title}
                  className="politics-news-image"
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = 'http://localhost:8889/images/no-image.jpg';
                  }}
                />
                <div className="politics-news-content">
                  <div className="politics-news-category">Politics</div>
                  <div className="politics-news-title">{item.title}</div>
                  <div className="politics-news-summary">
                    {item.summary?.length > 120
                      ? item.summary.slice(0, 120) + '...'
                      : item.summary}
                  </div>
                  <div className="politics-news-date">
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

export default Politics;
