import { useEffect, useState } from 'react';
import axios from 'axios';
import { Spin, Empty, Button } from 'antd';
import { LikeOutlined, LikeFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './homeducation.css';

// ✅ Optional: Move this to config.js for reuse
const BASE_URL = 'https://newsbackend-73b7.onrender.com';

const HomeEducation = () => {
  const [educationNews, setEducationNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState({});
  const navigate = useNavigate();

  const getEducationNews = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/News`);
      const education = response.data.filter(
        item => item.category?.toLowerCase() === 'education'
      );
      setEducationNews(education);

      const initialLikes = {};
      education.slice(0, 4).forEach(item => {
        initialLikes[item._id] = false;
      });
      setLikes(initialLikes);
    } catch (err) {
      console.error('Failed to fetch education news', err);
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
    getEducationNews();
  }, []);

  return (
    <div className="home-education-section">
      {loading ? (
        <div className="home-education-loader">
          <Spin size="large" />
        </div>
      ) : educationNews.length === 0 ? (
        <Empty
          description="No education news available"
          className="home-education-empty-state"
        />
      ) : (
        <div className="home-education-news-listing">
          {educationNews.slice(0, 4).map(item => (
            <div
              key={item._id}
              className="home-education-news-card"
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
                className="home-education-news-image"
                onError={e => {
                  e.target.onerror = null;
                  e.target.src = `${BASE_URL}/images/no-image.jpg`;
                }}
              />
              <div className="home-education-news-content">
                <div className="home-education-news-category">Education</div>
                <div className="home-education-news-title">{item.title}</div>

                <div className="home-education-news-date">
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

export default HomeEducation;
