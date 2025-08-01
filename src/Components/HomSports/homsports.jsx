import './homsports.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Spin, Empty, Button } from 'antd';
import { LikeOutlined, LikeFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const HomSports = () => {
  const [sportsNews, setSportsNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState({});
  const navigate = useNavigate();

  const getSportsNews = async () => {
    try {
      const response = await axios.get('https://newsbackend-73b7.onrender.com/api/News');
      const sports = response.data.filter(
        (item) => item.category?.toLowerCase() === 'sports'
      );
      setSportsNews(sports);

      const initialLikes = {};
      sports.slice(0, 3).forEach((item) => {
        initialLikes[item._id] = false;
      });
      setLikes(initialLikes);
    } catch (err) {
      console.error('Failed to fetch sports news', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = (id) => {
    setLikes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const onCardClick = (id) => {
    navigate(`/news/${id}`);
  };

  useEffect(() => {
    getSportsNews();
  }, []);

  return (
    <div className="home-sports-section">
      {loading ? (
        <div className="home-sports-loader">
          <Spin size="large" />
        </div>
      ) : sportsNews.length === 0 ? (
        <Empty
          description="No sports news available"
          className="home-sports-empty-state"
        />
      ) : (
        <div className="home-sports-news-listing">
          {sportsNews.slice(0, 3).map((item) => (
            <div
              key={item._id}
              className="home-sports-news-card"
              onClick={() => onCardClick(item._id)}
            >
              <img
                src={
                  item.images && item.images.length > 0
                    ? item.images[0]
                    : 'https://newsbackend-73b7.onrender.com/images/no-image.jpg'
                }
                alt={item.title}
                className="home-sports-news-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    'https://newsbackend-73b7.onrender.com/images/no-image.jpg';
                }}
              />
              <div className="home-sports-news-content">
                <div className="home-sports-news-category">Sports</div>
                <div className="home-sports-news-title">{item.title}</div>
                <div className="home-sports-news-summary">
                  {item.summary?.length > 100
                    ? item.summary.slice(0, 100) + '...'
                    : item.summary}
                </div>
                <div className="home-sports-news-like">
                  <Button
                    type="text"
                    icon={
                      likes[item._id] ? (
                        <LikeFilled style={{ color: 'red' }} />
                      ) : (
                        <LikeOutlined />
                      )
                    }
                    onClick={(e) => {
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

export default HomSports;
