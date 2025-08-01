import { useEffect, useState } from 'react';
import axios from 'axios';
import { Spin, Empty, Button } from 'antd';
import { LikeOutlined, LikeFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './homBusiness.css';

// ✅ Use your Render backend
const BASE_URL = 'https://newsbackend-73b7.onrender.com';

const HomeBusiness = () => {
  const [businessNews, setBusinessNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState({});
  const navigate = useNavigate();

  const getBusinessNews = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/News`);
      const business = response.data.filter(
        item => item.category?.toLowerCase() === 'business'
      );
      setBusinessNews(business);

      const initialLikes = {};
      business.forEach(item => {
        initialLikes[item._id] = false;
      });
      setLikes(initialLikes);
    } catch (err) {
      console.error('Failed to fetch business news', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = id => {
    setLikes(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const onCardClick = id => {
    navigate(`/news/${id}`);
  };

  useEffect(() => {
    getBusinessNews();
  }, []);

  return (
    <div className="home-business-section">
      {loading ? (
        <div className="home-business-loader">
          <Spin size="large" />
        </div>
      ) : businessNews.length === 0 ? (
        <Empty
          description="No business news available"
          className="home-business-empty-state"
        />
      ) : (
        <div className="home-business-news-listing">
          {businessNews.slice(0, 3).map(item => (
            <div
              key={item._id}
              className="home-business-news-card"
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
                className="home-business-news-image"
                onError={e => {
                  e.target.onerror = null;
                  e.target.src = `${BASE_URL}/images/no-image.jpg`;
                }}
              />
              <div className="home-business-news-content">
                <div className="home-business-news-category">Business</div>
                <div className="home-business-news-title">{item.title}</div>
                <div className="home-business-news-summary">
                  {item.summary?.length > 100
                    ? item.summary.slice(0, 100) + '...'
                    : item.summary}
                </div>
                <div className="home-business-news-date">
                  <Button
                    type="text"
                    icon={
                      likes[item._id] ? (
                        <LikeFilled style={{ color: 'red' }} />
                      ) : (
                        <LikeOutlined />
                      )
                    }
                    onClick={e => {
                      e.stopPropagation();
                      handleLike(item._id);
                    }}
                  >
                    {likes[item._id] ? 1 : 0}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomeBusiness;
