import { useEffect, useState } from 'react';
import axios from 'axios';
import { Spin, Empty, Typography, Button } from 'antd';
import { LikeOutlined, LikeFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './hompolitics.css';

const { Title } = Typography;

const HomePolitics = () => {
  const [politicsNews, setPoliticsNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState({});
  const navigate = useNavigate();

  const getPoliticsNews = async () => {
    try {
      const response = await axios.get('http://localhost:8889/api/News');
      const politics = response.data.filter(
        item => item.category?.toLowerCase() === 'politics'
      );
      setPoliticsNews(politics);

      const initialLikes = {};
      politics.forEach(item => {
        initialLikes[item._id] = false;
      });
      setLikes(initialLikes);
    } catch (err) {
      console.error('Failed to fetch politics news', err);
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
    getPoliticsNews();
  }, []);

  return (
    <div className="home-politics-section">
      {loading ? (
        <div className="home-politics-loader">
          <Spin size="large" />
        </div>
      ) : politicsNews.length === 0 ? (
        <Empty
          description="No politics news available"
          className="home-politics-empty-state"
        />
      ) : (
        <div className="home-politics-news-listing">
          {politicsNews.slice(0, 6).map(item => (
            <div
              key={item._id}
              className="home-politics-news-card"
              onClick={() => onCardClick(item._id)}
            >
              <img
                src={
                  (item.images && item.images.length > 0
                    ? item.images[0]
                    : 'http://localhost:8889/images/no-image.jpg')
                }
                alt={item.title}
                className="home-politics-news-image"
                onError={e => {
                  e.target.onerror = null;
                  e.target.src = 'http://localhost:8889/images/no-image.jpg';
                }}
              />
              <div className="home-politics-news-content">
                <div className="home-politics-news-category">Politics</div>
                <div className="home-politics-news-title">{item.title}</div>
                <div className="home-politics-news-summary">
                  {item.summary?.length > 100
                    ? item.summary.slice(0, 100) + '...'
                    : item.summary}
                </div>
                <div className="home-politics-news-date">
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
                      e.stopPropagation(); // Prevent navigation
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

export default HomePolitics;
